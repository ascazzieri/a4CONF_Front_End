#!/usr/bin/python3 -u

from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
import threading
import ssl

import mycolors
import mytime

def log_prefix(): return f"{mycolors.ENDC}{mytime.log()}{mycolors.LightMagenta}HTTP -> "

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    allow_reuse_address = True

    def shutdown(self):
        self.socket.close()
        HTTPServer.shutdown(self)

class SimpleHttpServer():
    def __init__(self, ip: str, port: int, ssl_on: bool, handler: BaseHTTPRequestHandler, certfile: str = None, keyfile: str = None):
        self.server = ThreadedHTTPServer((ip,port), handler)
        self.ip = ip
        self.port = port
        self.ssl_on = ssl_on
        if self.ssl_on:
            self.certfile = certfile
            self.keyfile = keyfile
            self.server.socket = ssl.wrap_socket(sock = self.server.socket, certfile = self.certfile, keyfile = self.keyfile, server_side = True, cert_reqs = ssl.CERT_REQUIRED)

    def start(self):
        self.server_thread = threading.Thread(target=self.server.serve_forever)
        self.server_thread.daemon = True
        self.server_thread.start()
        print(f"{log_prefix()}HTTP Server listening on '{self.ip}:{self.port}' ", flush=True, end=", ")
        if self.ssl_on: print(f"TLS is ON", flush = True)
        else: print(f"TLS is OFF", flush = True)

    def waitForThread(self):
        self.server_thread.join()

    def stop(self):
        self.server.shutdown()
        self.waitForThread()
