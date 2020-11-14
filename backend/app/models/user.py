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
            cursor = self.app.mysql_conn.cursor()
            stmt = 'SELECT user_id FROM tokens WHERE token = %s'
            value = (user_token,)
            cursor.execute(stmt, value)
            result = cursor.fetchone()
            cursor.close()
            if not result:
                return 0
            return result[0]
        except:
            try:
                cursor.close()
            except:
                pass
            return 0

    async def get_user_data(self, current_user):
        try:
            cursor = self.app.mysql_conn.cursor()
            stmt = 'SELECT email, first_name, last_name, birth_date, \
                gender, timestamp FROM accounts WHERE id = %s'
            value = (current_user,)
            cursor.execute(stmt, value)
            fetched = cursor.fetchone()[0]
            cursor.close()
            return {'status': 'success', 'user_data': {
                'email': fetched[0],
                'first_name': fetched[1],
                'last_name': fetched[2],
                'birth_data': fetched[3],
                'gender': fetched[4],
                'created_at': fetched[5]
            }}
        except:
            try:
                cursor.close()
            except:
                pass
            return {'status': 'incorrect id or password.'}

    async def get_all_users(self):
        try:
            cursor = self.app.mysql_conn.cursor()
            stmt = 'SELECT id, first_name, last_name FROM accounts'
            # value = ()
            cursor.execute(stmt)
            users = [
                {
                    'id': user[0],
                    'first_name': user[1],
                    'last_name': user[2],
                }
                for user in cursor.fetchall()
            ]
            cursor.close()
            return {'status': 'success', 'users': users}
        except:
            try:
                cursor.close()
            except:
                pass
            return {'status': 'err'}

    async def login(self, account_id, pwd):
        try:
            email = account_id
            password = pwd
            timestamp = str(datetime.now().timestamp())
            token = token_hex()

            cursor = self.app.mysql_conn.cursor()
            stmt = 'SELECT id, hashed_password, salt FROM accounts WHERE email = %s'
            value = (email,)
            cursor.execute(stmt, value)
            result = cursor.fetchone()
            cursor.close()
            if result and result[1] == sha512((password + result[2]).encode('utf-8')).hexdigest():
                cursor = self.app.mysql_conn.cursor()
                stmt = 'INSERT INTO tokens (user_id, token, timestamp) VALUES (%s, %s, %s)'
                value = (result[0], token, timestamp)
                cursor.execute(stmt, value)
                self.app.mysql_conn.commit()
                cursor.close()
                return {'status': 'success.', 'token': token}
            return {'status': 'incorrect id or password.'}
        except:
            try:
                cursor.close()
            except:
                pass
            return {'status': 'Bad Request.', 'reason': 'Unknown Error.'}

    async def register(self, account_id, first_name, last_name, pwd, birth_date, gender):
        try:
            if is_email(account_id):
                email = account_id
            else:
                return {'status': 'Bad Request.', 'reason': 'account_id is not an email.'}
            password = pwd
            salt = uuid4().hex
            hashed_password = sha512(
                (password + salt).encode('utf-8')).hexdigest()
            timestamp = str(datetime.now().timestamp())

            if not email or not password or not birth_date \
                    or not gender or not first_name:
                return {'status': 'Bad Request.', 'reason': 'Please fill all data.'}

            cursor = self.app.mysql_conn.cursor()
            stmt = 'SELECT count(*) FROM accounts WHERE email = %s'
            value = (email,)
            cursor.execute(stmt, value)
            if cursor.fetchone()[0]:
                cursor.close()
                return {'status': 'already registered.'}
            stmt = 'INSERT INTO accounts (email, first_name, last_name,\
                hashed_password, salt, birth_date, gender, timestamp) VALUES (%s, %s, %s, %s, %s,\
                    %s, %s, %s)'
            value = (email, first_name, last_name,
                     hashed_password, salt, birth_date, gender, timestamp)
            cursor.execute(stmt, value)
            self.app.mysql_conn.commit()
            cursor.close()
            return {'status': 'success.'}
        except:
            try:
                cursor.close()
            except:
                pass
            return {'status': 'Bad Request.', 'reason': 'Unknown Error.'}

    async def get_friend(self, current_user):
        try:
            cursor = self.app.mysql_conn.cursor()
            stmt = 'SELECT accounts.id, accounts.email, accounts.first_name, accounts.last_name, accounts.birth_date, \
                accounts.gender FROM friends INNER JOIN accounts ON friends.to_user_id=accounts.id WHERE friends.from_user_id = %s'
            value = (current_user,)
            cursor.execute(stmt, value)
            friends = [
                {
                    'id': friend[0],
                    'email': friend[1],
                    'first_name': friend[2],
                    'last_name': friend[3],
                    'birth_date': friend[4],
                    'gender': friend[5]
                }
                for friend in cursor.fetchall()
            ]
            cursor.close()
            return {'friends': friends}
        except:
            try:
                cursor.close()
            except:
                pass
            return {'friends': []}

    async def make_friend(self, current_user, target):
        try:
            timestamp = str(datetime.now().timestamp())
            cursor = self.app.mysql_conn.cursor()
            stmt = 'SELECT count(*) FROM friends WHERE from_user_id = %s AND to_user_id = %s'
            value = (current_user, target)
            cursor.execute(stmt, value)
            if cursor.fetchone()[0]:
                stmt = 'DELETE FROM friends WHERE from_user_id = %s AND to_user_id = %s'
                value = (current_user, target)
                cursor.execute(stmt, value)
                value = (target, current_user)
                cursor.execute(stmt, value)
                self.app.mysql_conn.commit()
            else:
                stmt = 'INSERT INTO friends (from_user_id, to_user_id, added_time, last_interact_id) VALUES (%s, %s, %s, %s)'
                value = (current_user, target, timestamp, None)
                cursor.execute(stmt, value)
                value = (target, current_user, timestamp, None)
                cursor.execute(stmt, value)
                self.app.mysql_conn.commit()
            cursor.close()
            return {'status': 'success.'}
        except:
            try:
                cursor.close()
            except:
                pass
            return {'status': 'Bad Request.', 'reason': 'Unknown Error.'}
