from flask import Flask
import logging
from logging.handlers import RotatingFileHandler
import os

def create_app():
    app = Flask(__name__)
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB 파일 크기 제한

    # 로깅 설정
    if not os.path.exists('./logs'):
        os.makedirs('./logs')
    handler = RotatingFileHandler('./logs/app.log', maxBytes=100000, backupCount=3)
    handler.setLevel(logging.INFO)
    app.logger.addHandler(handler)

    from .routes import api
    app.register_blueprint(api)

    return app
