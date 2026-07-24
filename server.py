#!/usr/bin/env python3
"""Static file server + form handler for MS Detailing Carbon."""
import http.server
import socketserver
import os
import json
import io
import hashlib
import hmac
import email
import email.parser
import email.policy
import urllib.request
import urllib.parse

PORT      = 5000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
TG_TOKEN  = os.environ.get('TG_BOT_TOKEN', '')
TG_CHAT   = os.environ.get('TG_CHAT_ID', '')
SESSION_SECRET = os.environ.get('SESSION_SECRET', '')


def config_status():
    """Return configuration readiness without exposing secret values."""
    return {
        'telegram': bool(TG_TOKEN and TG_CHAT),
        'session': bool(SESSION_SECRET),
    }


def request_id(fields, photos):
    """Create a short, non-reversible correlation id for a submitted request."""
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
        body.write(f'Content-Disposition: form-data; name="photo"; filename="{fname}"\r\n'.encode())
        body.write(f'Content-Type: {fmime}\r\n\r\n'.encode())
        body.write(fdata + b'\r\n')
    body.write(b'--' + boundary + b'--\r\n')
    ctype = 'multipart/form-data; boundary=MSDetailBound2025'
    return body.getvalue(), ctype


def tg_call(method, fields, files=None):
    body, ctype = _build_multipart(fields, files)
    req = urllib.request.Request(
        f'https://api.telegram.org/bot{TG_TOKEN}/{method}',
        data=body,
        headers={'Content-Type': ctype}
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def send_to_telegram(name, phone, request_text, photos, promo_code=''):
    lines = ['📋 <b>Новая заявка — MS Detailing Carbon</b>', '']
    if promo_code:
        lines.append(f'🎟 <b>ПРОМОКОД: {promo_code} — скидка 25%</b>')
        lines.append('')
    if name:         lines.append(f'👤 <b>Имя:</b> {name}')
    if phone:        lines.append(f'📞 <b>Телефон:</b> {phone}')
    if request_text: lines.append(f'💬 <b>Запрос:</b> {request_text}')
    text = '\n'.join(lines)

    if photos:
        tg_call('sendPhoto', {
            'chat_id': TG_CHAT, 'caption': text, 'parse_mode': 'HTML'
        }, [photos[0]])
        for p in photos[1:]:
            tg_call('sendPhoto', {'chat_id': TG_CHAT}, [p])
    else:
        tg_call('sendMessage', {
            'chat_id': TG_CHAT, 'text': text, 'parse_mode': 'HTML'
        })


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        if args[1] not in ('200', '304'):
            super().log_message(format, *args)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def _parse_multipart(self):
        """Parse multipart/form-data manually (cgi module removed in Python 3.13)."""
        content_type = self.headers.get('Content-Type', '')
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)

        boundary = None
        for part in content_type.split(';'):
            part = part.strip()
            if part.startswith('boundary='):
                boundary = part[9:].strip('"').encode()
                break
        if not boundary:
            return {}, []

        fields = {}
        files  = []
        delimiter = b'--' + boundary
        segments = body.split(delimiter)

        for seg in segments[1:]:
            if seg.startswith(b'--'):
                break
            if seg.startswith(b'\r\n'):
                seg = seg[2:]
            split = seg.find(b'\r\n\r\n')
            if split == -1:
                continue
            raw_headers = seg[:split]
            data = seg[split + 4:]
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

            field_name = params.get('name', '')
            filename   = params.get('filename', '')
            if filename:
                mime = headers.get('content-type', 'image/jpeg')
                files.append((filename, data, mime))
            else:
                fields[field_name] = data.decode('utf-8', errors='replace')

        return fields, files

    def _json_response(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path != '/submit':
            self.send_response(404)
            self.end_headers()
            return

        status = config_status()
        if not status['telegram'] or not status['session']:
            self._json_response(503, {
                'ok': False,
                'error': 'Notification service is not configured',
            })
            return

        try:
            fields, photos = self._parse_multipart()
            name         = fields.get('name',    '').strip()
            # Accept phone from field 'phone' (section form) or 'tg_nick' (legacy modal)
            phone        = fields.get('phone',   fields.get('tg_nick', '')).strip()
            request_text = fields.get('request', '').strip()
            promo_code   = fields.get('promo_code', '').strip()

            submission_id = request_id(fields, photos)
            send_to_telegram(name, phone, request_text, photos, promo_code)
            print(f'[submit] delivered request {submission_id}')
            self._json_response(200, {'ok': True})

        except Exception as e:
            print(f'[submit error] {e}')
            self._json_response(500, {'ok': False, 'error': str(e)})


def main():
    socketserver.TCPServer.allow_reuse_address = True
    status = config_status()
    print(
        'MS Detailing Carbon server running on port '
        f'{PORT} (telegram={"ready" if status["telegram"] else "missing"}, '
        f'session={"ready" if status["session"] else "missing"})'
    )
    with socketserver.TCPServer(('0.0.0.0', PORT), Handler) as httpd:
        httpd.serve_forever()


if __name__ == '__main__':
    main()
