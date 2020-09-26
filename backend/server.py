from aiohttp import web, ClientSession
from aiomysql import connect
from aiohttp_tokenauth import token_auth_middleware
from asyncio import get_event_loop
from dotenv import load_dotenv
from os import getenv
from jwt import decode

load_dotenv()

DATABASE_NAME = getenv('DATABASE_NAME')
HOST = getenv('HOST')
USER = getenv('USER')
PASSWORD = getenv('PASSWORD')
PORT = int(getenv('PORT'))
SECRET = getenv('SECRET')

async def init(loop):

    routes = web.RouteTableDef()

    conn = await connect(host=HOST, port=PORT,
    user=USER, password=PASSWORD,
    db=DATABASE_NAME, loop=loop
    )

    @routes.post('/login')
    async def handle_login(request):
        # TODO
        return web.Response(text='OK')

    @routes.post('/register')
    async def handle_register(request):
        # TODO
        return web.Response(text='OK')

    async def user_loader(token: str):
        try:
            user = decode(token, SECRET, algorithms=['HS256']) # TODO 
        except:
            user = None
        finally:
            return user

    app = web.Application(middlewares=[token_auth_middleware(user_loader)])
    app.add_routes(routes)
    return app

if __name__ == '__main__':
    loop = get_event_loop()
    web.run_app(loop.run_until_complete(init(loop)))    