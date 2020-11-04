from app.models.base import BaseModel
from datetime import datetime

def generate_news_feed(news_feed):
    if news_feed[7]:
        return {
                    'id': news_feed[0],
                    'content_type': news_feed[1],
                    'content': news_feed[2],
                    'owner_id': news_feed[3],
                    'owner_name': news_feed[4] + ' ' + news_feed[5],
                    'like': news_feed[7].replace('dislike','').count('like'),
                    'dislike': news_feed[7].count('dislike'),
                    'timestamp': news_feed[6]
                }
    return {
                'id': news_feed[0],
                'content_type': news_feed[1],
                'content': news_feed[2],
                'owner_id': news_feed[3],
                'owner_name': news_feed[4] + ' ' + news_feed[5],
                'like': 0,
                'dislike': 0,
                'timestamp': news_feed[6]
            }

class NewsFeed(BaseModel):

    async def get_news_feed(self, current_user):
        try:
            cursor = self.app.mysql_conn.cursor()
            stmt = 'SELECT feed.id, feed.type, feed.content, accounts.id, accounts.first_name, accounts.last_name, \
                feed.timestamp, GROUP_CONCAT(logs.action) FROM userfeed INNER JOIN feed ON feed.id=userfeed.feed_id \
                INNER JOIN accounts ON userfeed.user_id=accounts.id LEFT JOIN logs ON feed.id=logs.interact_to_feed_id\
                 WHERE userfeed.user_id = %s GROUP BY feed.id'
            value = (current_user,) 
            cursor.execute(stmt, value)
            news_feed = [ generate_news_feed(feed) for feed in cursor.fetchall() ]
            cursor.close()
            return {'news_feed':news_feed}
        except:
            try:
                cursor.close()
            except:
                pass            
            return {'news_feed':[]}

    async def create(self, current_user, content, content_type):
        try:
            timestamp = str(datetime.now().timestamp())
            cursor = self.app.mysql_conn.cursor()
            stmt = 'INSERT INTO feed (type, content, owner_id, timestamp) VALUES (%s, %s, %s, %s)'
            value = (content_type, content, current_user, timestamp)
            cursor.execute(stmt, value)                   
            self.app.mysql_conn.commit()  
            cursor.close()
            return {'status': 'success.'}
        except:
            try:
                cursor.close()
            except:
                pass            
            return {'status':'Bad Request.', 'reason':'Unknown Error.'}

    async def update(self, current_user, target, content, content_type):
        try:
            cursor = self.app.mysql_conn.cursor()
            stmt = 'UPDATE feed SET type = %s, content = %s WHERE id = %s AND owner_id = %s'
            value = (content_type, content, target, current_user)
            cursor.execute(stmt, value)                   
            self.app.mysql_conn.commit()  
            cursor.close()
            return {'status': 'success.'}
        except:
            try:
                cursor.close()
            except:
                pass            
            return {'status':'Bad Request.', 'reason':'Unknown Error.'}

    async def delete(self, current_user, target):
        try:
            cursor = self.app.mysql_conn.cursor()
            stmt = 'DELETE FROM feed WHERE id = %s AND owner_id = %s'
            value = (target, current_user)
            cursor.execute(stmt, value)                   
            self.app.mysql_conn.commit()  
            cursor.close()
            return {'status': 'success.'}
        except:
            try:
                cursor.close()
            except:
                pass            
            return {'status':'Bad Request.', 'reason':'Unknown Error.'}

    async def interact(self, current_user, target, action):
        try:
            timestamp = str(datetime.now().timestamp())
            cursor = self.app.mysql_conn.cursor()
            stmt = 'INSERT INTO logs (user_id, interact_to_feed_id, action, timestamp) VALUES (%s, %s, %s, %s)'
            value = (current_user, target, action, timestamp)
            cursor.execute(stmt, value)
            stmt = 'UPDATE friends, feed SET friends.last_interact_id = feed.id WHERE friends.from_user_id = %s \
                AND feed.owner_id = friends.to_user_id AND feed.id = %s'
            value = (current_user, target)
            cursor.execute(stmt, value)
            self.app.mysql_conn.commit()
            cursor.close()
            return {'status': 'success.'}
        except:
            try:
                cursor.close()
            except:
                pass            
            return {'status':'Bad Request.', 'reason':'Unknown Error.'}