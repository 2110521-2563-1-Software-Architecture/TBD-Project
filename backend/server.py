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

def check_timestamp(timestamp):
    # TODO check
    return True

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

    @routes.post('/login') # passed
    async def handle_login(request):
        try:
            decode(request.headers.get('Authorization'), SECRET, ALGORITHM)
        except:
            return web.HTTPForbidden(text='Invalid Token')  
        try:
            js = await request.json()

            email = js['account_id']
            password = js['pwd']
            timestamp = str(datetime.now().timestamp())

            # generate access token
            payload = {'email':email, 'timestamp':timestamp}
            token = encode(payload, SECRET, algorithm=ALGORITHM[0]).decode('utf-8')

            async with conn.cursor() as cursor:
                stmt = 'SELECT id, hashed_password, salt FROM accounts WHERE email = %s'
                value = email
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close() 
            if result and result[1] == sha512((password + result[2]).encode('utf-8')).hexdigest():
                async with conn.cursor() as cursor:
                    stmt = 'INSERT INTO tokens (user_id, token, timestamp) VALUES (%s, %s, %s)'
                    value = (result[0], token, timestamp)
                    await cursor.execute(stmt, value)
                    await conn.commit() 
                    await cursor.close()
                return web.json_response({'status':'success.', 'token':token})
            return web.json_response({'status':'incorrect id or password.'})
        except:
            return web.HTTPBadRequest()

    @routes.post('/register') # passed
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
                value = email
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

    @routes.post('/feed') # passed
    async def handle_post_feed(request):
        try:
            decode(request.headers.get('Authorization'), SECRET, ALGORITHM)
            user_token = request.headers.get('User')
            timestamp = str(datetime.now().timestamp())
            async with conn.cursor() as cursor:
                stmt = 'SELECT user_id, timestamp FROM tokens WHERE token = %s'
                value = user_token
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close()      
                if not result or not check_timestamp(result[1]):
                    raise Exception()  
                user = result[0]
        except:
            return web.HTTPForbidden(text='Please Re-login') 
        try:
            js = await request.json()
            content_type = js['content_type']
            content = js['content']
            async with conn.cursor() as cursor:
                stmt = 'INSERT INTO feed (type, content, owner_id, timestamp) VALUES (%s, %s, %s, %s)'
                value = (content_type, content, user, timestamp)
                await cursor.execute(stmt, value)                   
                await conn.commit()  
                await cursor.close()
            return web.json_response({'status': 'success.'})
        except:
            return web.HTTPBadRequest()

    @routes.get('/feed') # passed
    async def handle_get_feed(request):
        try:
            decode(request.headers.get('Authorization'), SECRET, ALGORITHM)
            user_token = request.headers.get('User')
            async with conn.cursor() as cursor:
                stmt = 'SELECT user_id, timestamp FROM tokens WHERE token = %s'
                value = user_token
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close()      
                if not result or not check_timestamp(result[1]):
                    raise Exception()   
                user = result[0]
        except:
            return web.HTTPForbidden(text='Please Re-login') 
        try:
            async with conn.cursor() as cursor:
                stmt = 'SELECT feed_id FROM userfeed WHERE user_id = %s'
                value = user
                await cursor.execute(stmt, value)
                list_of_ids = [feed_id[0] for feed_id in await cursor.fetchall()]
                format_strings = ','.join(['%s'] * len(list_of_ids))
                stmt = 'SELECT * FROM feed WHERE id IN (%s)' % format_strings
                value = tuple(list_of_ids)
                await cursor.execute(stmt, value)
                result = await cursor.fetchall()
                news_feed = [
                    {
                        'id': feed[0],
                        'content_type': feed[1],
                        'content': feed[2],
                        'owner_id': feed[3],
                        'timestamp': feed[4]
                    }
                    for feed in result
                ]
                await cursor.close() 
            return web.json_response({'news_feed':news_feed})
        except:
            return web.HTTPBadRequest()      

    @routes.post('/friend') # passed
    async def handle_post_friend(request):
        try:
            decode(request.headers.get('Authorization'), SECRET, ALGORITHM)
            user_token = request.headers.get('User')
            timestamp = str(datetime.now().timestamp())
            async with conn.cursor() as cursor:
                stmt = 'SELECT user_id, timestamp FROM tokens WHERE token = %s'
                value = user_token
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close()      
            if not result or not check_timestamp(result[1]):
                raise Exception()
            user = result[0]  
        except:
            return web.HTTPForbidden(text='Please Re-login') 
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
                    await conn.commit()   
                    await cursor.close() 
            else:
                async with conn.cursor() as cursor:
                    stmt = 'INSERT INTO friends (from_user_id, to_user_id, added_time, last_interact_id) VALUES (%s, %s, %s, %s)'
                    value = (user, target, timestamp, None)
                    await cursor.execute(stmt, value)
                    value = (target, user, timestamp, None)
                    await cursor.execute(stmt, value)                       
                    await conn.commit()   
                    await cursor.close()
            return web.json_response({'status': 'success.'})
        except:
            return web.HTTPBadRequest()     

    @routes.get('/friend') # passed
    async def handle_get_friend(request):
        try:
            decode(request.headers.get('Authorization'), SECRET, ALGORITHM)
            user_token = request.headers.get('User')
            async with conn.cursor() as cursor:
                stmt = 'SELECT user_id, timestamp FROM tokens WHERE token = %s'
                value = user_token
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close()      
            if not result or not check_timestamp(result[1]):
                raise Exception()
            user = result[0]
        except:
            return web.HTTPForbidden(text='Please Re-login') 
        try:            
            async with conn.cursor() as cursor:
                stmt = 'SELECT to_user_id FROM friends WHERE from_user_id = %s'
                value = user
                await cursor.execute(stmt, value)
                list_of_ids = [friend[0] for friend in await cursor.fetchall()]
                format_strings = ','.join(['%s'] * len(list_of_ids))
                stmt = 'SELECT id, email, first_name, last_name, birth_date, gender FROM accounts WHERE id IN (%s)' % format_strings
                value = tuple(list_of_ids)
                await cursor.execute(stmt, value)
                result = await cursor.fetchall()
                friends = [
                    {
                        'id': friend[0],
                        'email': friend[1],
                        'first_name': friend[2],
                        'last_name': friend[3],
                        'birth_date': friend[4],
                        'gender': friend[5]
                    }
                    for friend in result
                ]
                await cursor.close()         
            return web.json_response({'friends': friends})
        except:
            return web.HTTPBadRequest()                         

    @routes.post('/interact') # passed
    async def handle_post_interact(request):
        try:
            decode(request.headers.get('Authorization'), SECRET, ALGORITHM)
            user_token = request.headers.get('User')
            timestamp = str(datetime.now().timestamp())
            async with conn.cursor() as cursor:
                stmt = 'SELECT user_id, timestamp FROM tokens WHERE token = %s'
                value = user_token
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close()      
            if not result or not check_timestamp(result[1]):
                raise Exception()
            user = result[0]  
        except:
            return web.HTTPForbidden(text='Please Re-login') 
        try:
            js = await request.json()
            target = js['target']
            action = js['action']
            async with conn.cursor() as cursor:
                stmt = 'INSERT INTO logs (user_id, interact_to_feed_id, action, timestamp) VALUES (%s, %s, %s, %s)'
                value = (user, target, action, timestamp)
                await cursor.execute(stmt, value)    
                stmt = 'SELECT owner_id FROM feed WHERE id = %s'
                value = target
                await cursor.execute(stmt, value) 
                result = await cursor.fetchone()
                stmt = 'UPDATE friends SET last_interact_id = %s WHERE from_user_id = %s AND to_user_id = %s'    
                value = (target, user, result[0])
                await cursor.execute(stmt, value)          
                await conn.commit()   
                await cursor.close()
            return web.json_response({'status': 'success.'})
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