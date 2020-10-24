from app.models.base import BaseModel
from datetime import datetime

class NewsFeed(BaseModel):

    async def get_news_feed(self, current_user):
        try:
            async with self.app.mysql_conn.cursor() as cursor:
                stmt = 'SELECT feed_id FROM userfeed WHERE user_id = %s'
                value = current_user
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
            return {'news_feed':news_feed}
        except:
            return {'news_feed':[]}

    async def create(self, current_user, content, content_type):
        try:
            timestamp = str(datetime.now().timestamp())
            async with self.app.mysql_conn.cursor() as cursor:
                stmt = 'INSERT INTO feed (type, content, owner_id, timestamp) VALUES (%s, %s, %s, %s)'
                value = (content_type, content, current_user, timestamp)
                await cursor.execute(stmt, value)                   
                await self.app.mysql_conn.commit()  
                await cursor.close()
            return {'status': 'success.'}
        except:
            return {'status':'Bad Request.', 'reason':'Unknown Error.'}

    async def update(self, current_user, target, content, content_type):
        try:
            async with self.app.mysql_conn.cursor() as cursor:
                stmt = 'UPDATE feed SET type = %s, content = %s WHERE id = %s AND owner_id = %s'
                value = (content_type, content, target, current_user)
                await cursor.execute(stmt, value)                   
                await self.app.mysql_conn.commit()  
                await cursor.close()
            return {'status': 'success.'}
        except:
            return {'status':'Bad Request.', 'reason':'Unknown Error.'}

    async def delete(self, current_user, target):
        try:
            async with self.app.mysql_conn.cursor() as cursor:
                stmt = 'DELETE FROM feed WHERE id = %s AND owner_id = %s'
                value = (target, current_user)
                await cursor.execute(stmt, value)                   
                await self.app.mysql_conn.commit()  
                await cursor.close()
            return {'status': 'success.'}
        except:
            return {'status':'Bad Request.', 'reason':'Unknown Error.'}

    async def interact(self, current_user, target, action):
        try:
            timestamp = str(datetime.now().timestamp())
            async with self.app.mysql_conn.cursor() as cursor:
                stmt = 'INSERT INTO logs (user_id, interact_to_feed_id, action, timestamp) VALUES (%s, %s, %s, %s)'
                value = (current_user, target, action, timestamp)
                await cursor.execute(stmt, value)    
                stmt = 'SELECT owner_id FROM feed WHERE id = %s'
                value = target
                await cursor.execute(stmt, value)
                result = await cursor.fetchone()
                stmt = 'UPDATE friends SET last_interact_id = %s WHERE from_user_id = %s AND to_user_id = %s'
                value = (target, current_user, result[0])
                await cursor.execute(stmt, value)
                await self.app.mysql_conn.commit()
                await cursor.close()
            return {'status': 'success.'}
        except:
            return {'status':'Bad Request.', 'reason':'Unknown Error.'}