import os

from app.main import app
from waitress import serve
from paste.translogger import TransLogger


if __name__ == "__main__":
    PORT_NUMBER = int(os.environ.get("PORT", 33507))
    # PORT_NUMBER = int(os.environ.get("PORT", 8080)) # for fly.io

    print(f"Starting app in port {PORT_NUMBER}...")
    serve(TransLogger(app), host="0.0.0.0", port=PORT_NUMBER)  # default port is 8080
