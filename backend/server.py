from aiohttp import web, ClientSession
from aiomysql import connect
from aiohttp_tokenauth import token_auth_middleware
from asyncio import get_event_loop
from dotenv import load_dotenv
from os import getenv
from jwt import decode, encode
from datetime import datetime
from re import search, compile

EMAIL_REGEX = compile('[^@]+@[^@]+\.[^@]+')
ALGORITHM = ['HS256']

def is_email(email):
    global EMAIL_REGEX
    if search(EMAIL_REGEX, email):
        return True
    return False

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
        try:
            js = await request.json()
            if is_email(js['account_id']):
                email = js['account_id']
                phone_number = ''
            elif js['account_id']:
                email = ''
                phone_number = js['account_id']
            hashed_pwd = js['pwd']
            timestamp = str(datetime.now().timestamp())

            # generate access token
            payload = {'id':email+phone_number, 'timestamp':timestamp}
            token = encode(payload, SECRET, algorithm=ALGORITHM)

            if False: # TODO check token
                return web.HTTPForbidden(text='Invalid Token')

            async with conn.cursor() as cursor:
                stmt = 'SELECT * FROM Accounts WHERE email = %s AND phone_number = %s AND hashed_pwd = %s'
                value = (email, phone_number, hashed_pwd)
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close() 
            if result:
                async with conn.cursor() as cursor:
                    stmt = 'INSERT INTO Token (token, timestamp) VALUES (%s, %s)'
                    value = (token, timestamp)
                    await cursor.execute(stmt, value)
                    await cursor.close()
                return web.json_response({'result':'success.', 'token':token})
            return web.json_response({'result':'incorrect id or password.'})
        except:
            return web.HTTPBadRequest()

    @routes.post('/register')
    async def handle_register(request):
        try:
            js = await request.json()
            if is_email(js['account_id']):
                email = js['account_id']
                phone_number = ''
            elif js['account_id']:
                email = ''
                phone_number = js['account_id']
            first_name = js['first_name']
            last_name = js['last_name']
            hashed_pwd = js['pwd']
            birth_date = js['birth_date']
            gender = js['gender']
            timestamp = str(datetime.now().timestamp())

            #check if empty
            if (not email and not phone_number) or not hashed_pwd or\
                not birth_date or not gender or not first_name:
                return web.HTTPBadRequest()

            if False: # TODO check token
                return web.HTTPForbidden(text='Invalid Token')

            async with conn.cursor() as cursor: # TODO can update phone/email?
                stmt = 'SELECT * FROM Accounts WHERE email = %s AND phone_number = %s'
                value = (email, phone_number)
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close() 
            if result:
                return web.json_response({'result':'already registered.'})
            async with conn.cursor() as cursor:
                stmt = 'INSERT INTO Accounts (email, phone_number, first_name, last_name\
                    hashed_pwd, birth_date, gender, timestamp) VALUES (%s, %s, %s, %s, %s,\
                     %s, %s, %s)'
                value = (email, phone_number, first_name, last_name, 
                hashed_pwd, birth_date, gender, timestamp)
                await cursor.execute(stmt, value)                   
                await conn.commit()  
                await cursor.close()
            return web.json_response({'status': 'success.'})
        except Exception as err:
            return web.HTTPBadRequest()

    async def user_loader(token: str):
        try:
            user = decode(token, SECRET, algorithms=ALGORITHM) # TODO 
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