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

    async def get_news_feed(self, current_user, page, **kwargs):
        try:
            cursor = self.app.mysql_conn.cursor(buffered=True)
            stmt = 'SELECT feed.id, feed.type, feed.content, accounts.id, accounts.first_name, accounts.last_name, \
                feed.timestamp, GROUP_CONCAT(logs.action) FROM userfeed INNER JOIN feed ON feed.id=userfeed.feed_id \
                INNER JOIN accounts ON feed.owner_id=accounts.id LEFT JOIN logs ON feed.id=logs.interact_to_feed_id\
                 WHERE userfeed.user_id = %s GROUP BY feed.id'
            value = (current_user,) 
            cursor.execute(stmt, value)
            news_feed = [ generate_news_feed(feed) for feed in cursor.fetchall()[(page-1)*10:page*10+1] ]
            all_feed_id = [ nf['id'] for nf in news_feed ]
            format_strings = ','.join(['%s'] * len(all_feed_id))
            stmt = 'SELECT interact_to_feed_id, action FROM logs WHERE user_id = %s AND \
                interact_to_feed_id in ({})'.format(format_strings)
            value = (current_user, *tuple(all_feed_id))
            cursor.execute(stmt, value)
            actions = { k:v for k, v in cursor.fetchall()}
            for nf in news_feed:
                if nf['id'] in actions:
                    nf.update({'isLike':actions[nf['id']].strip().lower() == 'like',
                    'isLove':actions[nf['id']].strip().lower() == 'love'})
                else:
                    nf.update({'isLike':False, 'isLove':False})
            cursor.close()
            return {'news_feed':news_feed}
        except:
            try:
                cursor.close()
            except:
                pass
            return {'news_feed':[]}

    async def create(self, current_user, content, content_type, **kwargs):
        try:
            timestamp = str(datetime.now().timestamp())
            cursor = self.app.mysql_conn.cursor(buffered=True)
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

    async def update(self, current_user, target, content, content_type, **kwargs):
        try:
            cursor = self.app.mysql_conn.cursor(buffered=True)
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

    async def delete(self, current_user, target, **kwargs):
        try:
            cursor = self.app.mysql_conn.cursor(buffered=True)
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

    async def interact(self, current_user, target, action, **kwargs):
        try:
            timestamp = str(datetime.now().timestamp())
            cursor = self.app.mysql_conn.cursor(buffered=True)
            stmt = 'SELECT action FROM logs WHERE user_id = %s AND interact_to_feed_id = %s'
            value = (current_user, target)
            cursor.execute(stmt, value)
            fetched = cursor.fetchone()
            if not fetched:
                stmt = 'INSERT INTO logs (user_id, interact_to_feed_id, action, timestamp) VALUES (%s, %s, %s, %s)'
                value = (current_user, target, action, timestamp)
                cursor.execute(stmt, value)
                stmt = 'UPDATE friends, feed SET friends.last_interact_id = feed.id WHERE friends.from_user_id = %s \
                    AND feed.owner_id = friends.to_user_id AND feed.id = %s'
                value = (current_user, target)
                cursor.execute(stmt, value)
                self.app.mysql_conn.commit()
                cursor.close()
            elif fetched[0] == action:
                stmt = 'DELETE FROM logs WHERE user_id = %s AND interact_to_feed_id = %s AND action = %s'
                value = (current_user, target, action)
                cursor.execute(stmt, value)
                self.app.mysql_conn.commit()
                cursor.close()
            elif fetched[0] != action:
                stmt = 'UPDATE logs SET action = %s, timestamp = %s WHERE user_id = %s AND interact_to_feed_id = %s'
                value = (action, timestamp, current_user, target)
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

#def actionScore(action):
#    if action == "like":
#        return 2
#    if action == "love":
#        return 3

#def affinity(self):
#    affinity = dict()
#    getUser(self, affinityList)
#    cursor = self.app.mysql_conn.cursor()
#    stmt = 'SELECT feed.owner_id, logs.user_id, logs.action FROM feed JOIN logs ON feed.id = logs.interact_to_feed_id'
#    cursor.execute(stmt)
#    userList = cursor.fetchall()
#    for user in userList:
#       if user[0] not in [p for p in affinity.keys()]:
#           affinity[user[0]] = {user[1]:actionScore(user[2])}
#       else:
#           if user[1] not in [p for p in affinity[user[0]].keys()]:
#               affinity[user[0]][user[1]] = actionScore(user[2])
#           else:
#               affinity[user[0]][user[1]] += actionScore(user[2])
#     cursor.close()
