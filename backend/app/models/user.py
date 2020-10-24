from app.models.base import BaseModel
from datetime import datetime
from secrets import token_hex
from hashlib import sha512
from uuid import uuid4
from re import search, compile

def is_email(email):
    if search(compile('[^@]+@[^@]+\.[^@]+'), email):
        return True
    return False

class User(BaseModel):

    async def get_user(self, user_token):
        try:
            async with self.app.mysql_conn.cursor() as cursor:
                stmt = 'SELECT user_id FROM tokens WHERE token = %s'
                value = user_token
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close()      
                if not result:
                    return 0
                return result[0]
        except:
            return 0
    
    async def login(self, account_id, pwd):
        try:
            email = account_id
            password = pwd
            timestamp = str(datetime.now().timestamp())
            token = token_hex()

            async with self.app.mysql_conn.cursor() as cursor:
                stmt = 'SELECT id, hashed_password, salt FROM accounts WHERE email = %s'
                value = email
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close() 
            if result and result[1] == sha512((password + result[2]).encode('utf-8')).hexdigest():
                async with self.app.mysql_conn.cursor() as cursor:
                    stmt = 'INSERT INTO tokens (user_id, token, timestamp) VALUES (%s, %s, %s)'
                    value = (result[0], token, timestamp)
                    await cursor.execute(stmt, value)
                    await self.app.mysql_conn.commit() 
                    await cursor.close()
                return {'status':'success.', 'token':token}
            return {'status':'incorrect id or password.'}
        except:
            return {'status':'Bad Request.', 'reason':'Unknown Error.'}

    async def register(self, account_id, first_name, last_name, pwd, birth_date, gender): 
        try:
            if is_email(account_id):
                email = account_id
            else:
                return {'status':'Bad Request.', 'reason':'account_id is not an email.'}
            password = pwd
            salt = uuid4().hex
            hashed_password = sha512((password + salt).encode('utf-8')).hexdigest()
            timestamp = str(datetime.now().timestamp())

            if not email or not password or not birth_date \
                or not gender or not first_name:
                return {'status':'Bad Request.', 'reason':'Please fill all data.'}

            async with self.app.mysql_conn.cursor() as cursor:
                stmt = 'SELECT * FROM accounts WHERE email = %s'
                value = email
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close() 
            if result:
                return {'status':'already registered.'}
            async with self.app.mysql_conn.cursor() as cursor:
                stmt = 'INSERT INTO accounts (email, first_name, last_name,\
                    hashed_password, salt, birth_date, gender, timestamp) VALUES (%s, %s, %s, %s, %s,\
                     %s, %s, %s)'
                value = (email, first_name, last_name, 
                hashed_password, salt, birth_date, gender, timestamp)
                await cursor.execute(stmt, value)                   
                await self.app.mysql_conn.commit()  
                await cursor.close()
            return {'status': 'success.'}
        except:
            return {'status':'Bad Request.', 'reason':'Unknown Error.'}

    async def get_friend(self, current_user):
        try:            
            async with self.app.mysql_conn.cursor() as cursor:
                stmt = 'SELECT to_user_id FROM friends WHERE from_user_id = %s'
                value = current_user
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
            return {'friends': friends}
        except:
            return {'friends': []}

    async def make_friend(self, current_user, target):
        try:
            timestamp = str(datetime.now().timestamp())
            async with self.app.mysql_conn.cursor() as cursor:
                stmt = 'SELECT * FROM friends WHERE from_user_id = %s AND to_user_id = %s'
                value = (current_user, target)
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                await cursor.close()         
            if result:
                async with self.app.mysql_conn.cursor() as cursor:
                    stmt = 'DELETE FROM friends WHERE from_user_id = %s AND to_user_id = %s'
                    value = (current_user, target)
                    await cursor.execute(stmt, value)
                    value = (target, current_user)
                    await cursor.execute(stmt, value)                       
                    await self.app.mysql_conn.commit()   
                    await cursor.close() 
            else:
                async with self.app.mysql_conn.cursor() as cursor:
                    stmt = 'INSERT INTO friends (from_user_id, to_user_id, added_time, last_interact_id) VALUES (%s, %s, %s, %s)'
                    value = (current_user, target, timestamp, None)
                    await cursor.execute(stmt, value)
                    value = (target, current_user, timestamp, None)
                    await cursor.execute(stmt, value)                       
                    await self.app.mysql_conn.commit()   
                    await cursor.close()
            return {'status': 'success.'}
        except Exception as err:
            print(err)
            return {'status':'Bad Request.', 'reason':'Unknown Error.'}