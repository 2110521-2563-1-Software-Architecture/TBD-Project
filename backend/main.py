from aiohttp import web
from app.config.application import app_config

def main():
    app = web.Application()
    app_config(app)
    web.run_app(app)

if __name__ == '__main__':
    main()