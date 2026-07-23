#!/usr/bin/env python3
"""Static file server + form handler for MS Detailing Carbon."""
import http.server
import socketserver
import os
import json
import io
import email
import email.parser
import email.policy
import urllib.request
import urllib.parse

PORT      = 5000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
TG_TOKEN  = os.environ.get('TG_BOT_TOKEN', '')
TG_CHAT   = os.environ.get('TG_CHAT_ID', '')


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
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())


def send_to_telegram(name, tg_nick, request_text, photos):
    lines = ['📋 <b>Новая заявка — MS Detailing Carbon</b>', '']
    if name:         lines.append(f'👤 <b>Имя:</b> {name}')
    if tg_nick:      lines.append(f'✈️ <b>Telegram:</b> {tg_nick}')
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
        """Parse multipart/form-data using email module (cgi removed in 3.13)."""
        content_type = self.headers.get('Content-Type', '')
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)
        # email.parser needs a proper MIME message
        msg_bytes = b'Content-Type: ' + content_type.encode() + b'\r\n\r\n' + body
        msg = email.parser.BytesParser(policy=email.policy.compat32).parsebytes(msg_bytes)
        fields = {}
        files  = []
        if msg.is_multipart():
            for part in msg.get_payload():
                disp   = part.get('Content-Disposition', '')
                params = dict(p.strip().split('=', 1) for p in disp.split(';')[1:] if '=' in p)
                fname_field = params.get('name', '').strip('"')
                filename    = params.get('filename', '').strip('"')
                data = part.get_payload(decode=True)
                if filename:
                    mime = part.get_content_type() or 'image/jpeg'
                    files.append((filename, data, mime))
                else:
                    fields[fname_field] = (data or b'').decode('utf-8', errors='replace')
        return fields, files

    def do_POST(self):
        if self.path != '/submit':
            self.send_response(404)
            self.end_headers()
            return
        try:
            fields, photos = self._parse_multipart()
            name         = fields.get('name',    '').strip()
            tg_nick      = fields.get('tg_nick', '').strip()
            request_text = fields.get('request', '').strip()

            send_to_telegram(name, tg_nick, request_text, photos)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'ok': True}).encode())

        except Exception as e:
            print(f'[submit error] {e}')
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'ok': False, 'error': str(e)}).encode())


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('0.0.0.0', PORT), Handler) as httpd:
    print(f'MS Detailing Carbon server running on port {PORT}')
    httpd.serve_forever()
