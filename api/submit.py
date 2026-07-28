"""
Vercel serverless function — обработчик формы заявки.
POST /submit  →  отправляет данные в Telegram-бот.
"""
from http.server import BaseHTTPRequestHandler
import os
import json
import io
import hashlib
import hmac
import html
import urllib.request
import urllib.error

TG_TOKEN       = os.environ.get('TG_BOT_TOKEN', '')
TG_CHAT        = os.environ.get('TG_CHAT_ID', '')
SESSION_SECRET = os.environ.get('SESSION_SECRET', '')
PROMO_CODE     = 'CARBON25'


# ── helpers ──────────────────────────────────────────────────────────────────

def _config_ok():
    return bool(TG_TOKEN and TG_CHAT and SESSION_SECRET)


def _request_id(fields, photos):
    payload = '\x1f'.join([
        fields.get('name', ''),
        fields.get('phone', ''),
        fields.get('request', ''),
        str(len(photos)),
    ]).encode('utf-8')
    digest = hmac.new(
        SESSION_SECRET.encode('utf-8'),
        payload,
        hashlib.sha256,
    ).hexdigest()
    return digest[:12]


def _build_multipart(fields, files=None):
    boundary = b'MSDetailBound2025'
    body = io.BytesIO()
    for name, value in fields.items():
        body.write(b'--' + boundary + b'\r\n')
        body.write(f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode())
        body.write(value.encode('utf-8') + b'\r\n')
    for fname, fdata, fmime in (files or []):
        body.write(b'--' + boundary + b'\r\n')
        body.write(
            f'Content-Disposition: form-data; name="photo"; filename="{fname}"\r\n'.encode()
        )
        body.write(f'Content-Type: {fmime}\r\n\r\n'.encode())
        body.write(fdata + b'\r\n')
    body.write(b'--' + boundary + b'--\r\n')
    return body.getvalue(), 'multipart/form-data; boundary=MSDetailBound2025'


def _tg_call(method, fields, files=None):
    body, ctype = _build_multipart(fields, files)
    req = urllib.request.Request(
        f'https://api.telegram.org/bot{TG_TOKEN}/{method}',
        data=body,
        headers={'Content-Type': ctype},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            resp = json.loads(r.read())
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode('utf-8', errors='replace')
        try:
            desc = json.loads(raw).get('description')
        except Exception:
            desc = None
        raise RuntimeError(f"Telegram: {desc or 'HTTP ' + str(exc.code)}") from exc
    if not resp.get('ok'):
        raise RuntimeError(f"Telegram: {resp.get('description', 'unknown error')}")
    return resp


def _send(name, phone, request_text, photos, promo_code=''):
    used_promo = bool(promo_code) or PROMO_CODE.upper() in request_text.upper()
    lines = ['📋 <b>Новая заявка — MS Detailing Carbon</b>', '']
    if used_promo:
        lines += [f'🎟 <b>ПРОМОКОД {PROMO_CODE} — скидка 25%</b>', '']
    if name:         lines.append(f'👤 <b>Имя:</b> {html.escape(name)}')
    if phone:        lines.append(f'📞 <b>Телефон:</b> {html.escape(phone)}')
    if request_text: lines.append(f'💬 <b>Запрос:</b> {html.escape(request_text)}')
    text = '\n'.join(lines)

    if photos:
        _tg_call('sendPhoto', {
            'chat_id': TG_CHAT, 'caption': text, 'parse_mode': 'HTML',
        }, [photos[0]])
        for p in photos[1:]:
            _tg_call('sendPhoto', {'chat_id': TG_CHAT}, [p])
    else:
        _tg_call('sendMessage', {
            'chat_id': TG_CHAT, 'text': text, 'parse_mode': 'HTML',
        })


def _parse_multipart(body, content_type):
    boundary = None
    for part in content_type.split(';'):
        part = part.strip()
        if part.startswith('boundary='):
            boundary = part[9:].strip('"').encode()
            break
    if not boundary:
        return {}, []

    fields, files = {}, []
    for seg in body.split(b'--' + boundary)[1:]:
        if seg.startswith(b'--'):
            break
        if seg.startswith(b'\r\n'):
            seg = seg[2:]
        split = seg.find(b'\r\n\r\n')
        if split == -1:
            continue
        raw_headers, data = seg[:split], seg[split + 4:]
        if data.endswith(b'\r\n'):
            data = data[:-2]

        headers = {}
        for line in raw_headers.split(b'\r\n'):
            if b':' in line:
                k, v = line.split(b':', 1)
                headers[k.strip().lower().decode()] = v.strip().decode()

        disp = headers.get('content-disposition', '')
        params = {}
        for p in disp.split(';')[1:]:
            p = p.strip()
            if '=' in p:
                k, v = p.split('=', 1)
                params[k.strip()] = v.strip('"')

        fname = params.get('filename', '')
        fname_field = params.get('name', '')
        if fname:
            files.append((fname, data, headers.get('content-type', 'image/jpeg')))
        else:
            fields[fname_field] = data.decode('utf-8', errors='replace')

    return fields, files


# ── Vercel handler ────────────────────────────────────────────────────────────

class handler(BaseHTTPRequestHandler):

    def _json(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if not _config_ok():
            self._json(503, {'ok': False, 'error': 'Notification service is not configured'})
            return
        try:
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            fields, photos = _parse_multipart(body, self.headers.get('Content-Type', ''))

            name         = fields.get('name', '').strip()
            phone        = fields.get('phone', fields.get('tg_nick', '')).strip()
            request_text = fields.get('request', '').strip()
            promo_code   = fields.get('promo_code', '').strip()

            rid = _request_id(fields, photos)
            _send(name, phone, request_text, photos, promo_code)
            print(f'[submit] delivered {rid}')
            self._json(200, {'ok': True})
        except Exception as exc:
            print(f'[submit error] {exc}')
            self._json(500, {'ok': False, 'error': str(exc)})

    def log_message(self, fmt, *args):
        pass  # подавить стандартный лог Vercel
