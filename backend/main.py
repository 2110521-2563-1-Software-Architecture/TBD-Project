from aiohttp import web
from app.config.application import app_config
from os import environ

def main():
    app = web.Application()
    app_config(app)
    try:
        web.run_app(app, port=environ['PORT'])
    except KeyError:
        web.run_app(app)

if __name__ == '__main__':
    main()
