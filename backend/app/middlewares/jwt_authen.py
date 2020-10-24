from jwt import decode
from aiohttp import web

async def jwt_middleware(app, handler):
    async def middleware_handler(request):
        try:
            decode(request.headers.get('Authorization'), app.jwt_secret, ['HS256'])
        except:
            return web.HTTPUnauthorized() 
        return await handler(request)
    return middleware_handler