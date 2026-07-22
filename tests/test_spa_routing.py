import http.server
import os
import socketserver
import threading
import urllib.request

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="frontend/dist", **kwargs)

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path):
            self.path = "/index.html"
        return super().do_GET()

def test_server():
    server = socketserver.TCPServer(("127.0.0.1", 8089), SPAHandler)
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    try:
        r1 = urllib.request.urlopen("http://127.0.0.1:8089/").read().decode()
        r2 = urllib.request.urlopen("http://127.0.0.1:8089/login").read().decode()
        assert '<div id="app"' in r1
        assert '<div id="app"' in r2
        print("Static file SPA routing test PASSED")
    finally:
        server.shutdown()

if __name__ == "__main__":
    test_server()
