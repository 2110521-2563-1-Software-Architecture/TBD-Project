from aiohttp import web
from app.config.application import app_config
from app.middlewares import MIDDLEWARES

def main():
    app = web.Application(
        middlewares=MIDDLEWARES
    )
    app_config(app)
    web.run_app(app)

if __name__ == '__main__':
    main()