from aiohttp import web
from aiomysql import connect
from asyncio import get_event_loop
from dotenv import load_dotenv
from os import getenv
from jwt import decode, encode
from datetime import datetime
from re import search, compile
from aiohttp_cors import setup, ResourceOptions
from hashlib import sha512
from uuid import uuid4

EMAIL_REGEX = compile('[^@]+@[^@]+\.[^@]+')
ALGORITHM = ['HS256']

def is_email(email):
    global EMAIL_REGEX
    if search(EMAIL_REGEX, email):
        return True
    return False

load_dotenv()

DATABASE_NAME = getenv('DB_DATABASE')
HOST = getenv('DB_HOST')
USER = getenv('DB_USERNAME')
PASSWORD = getenv('DB_PASSWORD')
PORT = int(getenv('DB_PORT'))
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
            decode(request.headers.get('Authorization'), SECRET, ALGORITHM)
        except:
            return web.HTTPForbidden(text='Invalid Token')  
        try:
            js = await request.json()

            if is_email(js['account_id']):
                email = js['account_id']
            else:
                return web.HTTPBadRequest(text='account_id is not an email.')
            password = js['pwd']
            timestamp = str(datetime.now().timestamp())

            # generate access token
            payload = {'email':email, 'timestamp':timestamp}
            token = encode(payload, SECRET, algorithm=ALGORITHM[0]).decode('utf-8')

            async with conn.cursor() as cursor:
                stmt = 'SELECT hashed_password, salt FROM accounts WHERE email = %s'
                value = email
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close() 
            if result and result[0] == sha512((password + result[1]).encode('utf-8')).hexdigest():
                async with conn.cursor() as cursor:
                    stmt = 'INSERT INTO tokens (email, token, timestamp) VALUES (%s, %s, %s)'
                    value = (email, token, timestamp)
                    await cursor.execute(stmt, value)
                    await conn.commit() 
                    await cursor.close()
                return web.json_response({'status':'success.', 'token':token})
            return web.json_response({'status':'incorrect id or password.'})
        except:
            return web.HTTPBadRequest()

    @routes.post('/register')
    async def handle_register(request):
        try:
            decode(request.headers.get('Authorization'), SECRET, ALGORITHM)
        except:
            return web.HTTPForbidden(text='Invalid Token')  
        try:
            js = await request.json()
            if is_email(js['account_id']):
                email = js['account_id']
            else:
                return web.HTTPBadRequest(text='account_id is not an email.')
            first_name = js['first_name']
            last_name = js['last_name']
            password = js['pwd']
            salt = uuid4().hex
            hashed_password = sha512((password + salt).encode('utf-8')).hexdigest()
            birth_date = js['birth_date']
            gender = js['gender']
            timestamp = str(datetime.now().timestamp())

            #check if empty
            if not email or not password or not birth_date \
                or not gender or not first_name:
                return web.HTTPBadRequest()

            async with conn.cursor() as cursor:
                stmt = 'SELECT * FROM accounts WHERE email = %s'
                value = (email, )
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close() 
            if result:
                return web.json_response({'status':'already registered.'})
            async with conn.cursor() as cursor:
                stmt = 'INSERT INTO accounts (email, first_name, last_name,\
                    hashed_password, salt, birth_date, gender, timestamp) VALUES (%s, %s, %s, %s, %s,\
                     %s, %s, %s)'
                value = (email, first_name, last_name, 
                hashed_password, salt, birth_date, gender, timestamp)
                await cursor.execute(stmt, value)                   
                await conn.commit()  
                await cursor.close()
            return web.json_response({'status': 'success.'})
        except:
            return web.HTTPBadRequest()

    @routes.post('/feed')
    async def handle_post_status(request):
        try:
            decode(request.headers.get('Authorization'), SECRET, ALGORITHM)
            user = request.headers.get('User')
            async with conn.cursor() as cursor:
                stmt = 'SELECT timestamp FROM tokens WHERE token = %s'
                value = user
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close()      
                if not result:
                    raise Exception() 
                # elif
                # TODO check timestamp     
        except:
            return web.HTTPForbidden(text='Invalid Token') 
        try:
            js = await request.json()
            # TODO insert into feed+activity
            return web.json_response({'status': 'success.'})
        except:
            return web.HTTPBadRequest()

    @routes.get('/feed')
    async def handle_get_status(request):
        try:
            decode(request.headers.get('Authorization'), SECRET, ALGORITHM)
            user = request.headers.get('User')
            async with conn.cursor() as cursor:
                stmt = 'SELECT timestamp FROM tokens WHERE token = %s'
                value = user
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close()      
                if not result:
                    raise Exception() 
                # elif
                # TODO check timestamp     
        except:
            return web.HTTPForbidden(text='Invalid Token') 
        try:
            # TODO select content from feed(need algorithm)
            return web.json_response({})
        except:
            return web.HTTPBadRequest()      

    @routes.post('/friend')
    async def handle_post_friend(request):
        try:
            decode(request.headers.get('Authorization'), SECRET, ALGORITHM)
            user_token = request.headers.get('User')
            async with conn.cursor() as cursor:
                stmt = 'SELECT email, timestamp FROM tokens WHERE token = %s'
                value = user_token
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close()      
                if not result:
                    raise Exception() 
                user = result[0]
                timestamp = str(datetime.now().timestamp())
                # elif
                # TODO check timestamp     
        except:
            return web.HTTPForbidden(text='Invalid Token') 
        try:
            js = await request.json()
            target = js['target']
            async with conn.cursor() as cursor:
                stmt = 'SELECT * FROM friends WHERE from_user_id = %s AND to_user_id = %s'
                value = (user, target)
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close()         
                if result:
                    async with conn.cursor() as cursor:
                        stmt = 'DELETE FROM friends WHERE from_user_id = %s AND to_user_id = %s'
                        value = (user, target)
                        await cursor.execute(stmt, value)
                        value = (target, user)
                        await cursor.execute(stmt, value)
                        stmt = 'INSERT INTO logs (user_id, interact_to_user_id, action, timestamp) VALUES (%s, %s, %s, %s)'
                        value = (user, target, 'Remove Friend', timestamp)
                        await cursor.execute(stmt, value)
                        value = (target, user, 'Remove Friend', timestamp)
                        await cursor.execute(stmt, value)                        
                        await conn.commit()   
                        await cursor.close() 
                else:
                    async with conn.cursor() as cursor:
                        stmt = 'INSERT INTO friends (from_user_id, to_user_id, added_time, last_interact_id) VALUES (%s, %s, %s, %s)'
                        value = (user, target, timestamp, None)
                        await cursor.execute(stmt, value)
                        value = (target, user, timestamp, None)
                        await cursor.execute(stmt, value)
                        stmt = 'INSERT INTO logs (user_id, interact_to_user_id, action, timestamp) VALUES (%s, %s, %s, %s)'
                        value = (user, target, 'Add Friend', timestamp)
                        await cursor.execute(stmt, value)
                        value = (target, user, 'Add Friend', timestamp)
                        await cursor.execute(stmt, value)                        
                        await conn.commit()   
                        await cursor.close()
            return web.json_response({'status': 'success.'})
        except:
            return web.HTTPBadRequest()     

    @routes.get('/friend')
    async def handle_get_friend(request):
        try:
            decode(request.headers.get('Authorization'), SECRET, ALGORITHM)
            user_token = request.headers.get('User')
            async with conn.cursor() as cursor:
                stmt = 'SELECT email, timestamp FROM tokens WHERE token = %s'
                value = user_token
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close()      
                if not result:
                    raise Exception() 
                user = result[0]
                # elif
                # TODO check timestamp     
        except:
            return web.HTTPForbidden(text='Invalid Token') 
        try:            
            # TODO select * from friend
            async with conn.cursor() as cursor:
                stmt = 'SELECT to_user_id FROM friends WHERE from_user_id = %s'
                value = user
                await cursor.execute(stmt, value)
                result = await cursor.fetchall()
                await cursor.close()         
            return web.json_response({'friends': result})
        except:
            return web.HTTPBadRequest()                         

    app = web.Application()
    app.add_routes(routes)
    cors = setup(app, defaults={
        "*": ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
        )
    })
    
    for route in app.router.routes():
        cors.add(route)

    return app

if __name__ == '__main__':
    loop = get_event_loop()
    web.run_app(loop.run_until_complete(init(loop)))    