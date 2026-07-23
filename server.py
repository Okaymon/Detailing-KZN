#!/usr/bin/env python3
"""Simple static file server for MS Detailing website."""
import http.server
import socketserver
import os

PORT = 5000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Suppress routine access logs, keep errors
        if args[1] not in ('200', '304'):
            super().log_message(format, *args)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"MS Detailing server running on port {PORT}")
    httpd.serve_forever()
