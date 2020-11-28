from app.models.base import BaseModel
from datetime import datetime
import math

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

def actionScore(old_score,action,t):
    score = 0
    if action == "like":
        score = 2
    if action == "dislike":
        score = 3
    u = max(old_score, t/3600)
    v = min(old_score, t/3600)
    return (u + math.log(math.exp(v-u))) * score

class NewsFeed(BaseModel):

    def affinity(self, current_user):
        affinity = {}
        current = int(datetime.now().timestamp())
        cursor = self.app.mysql_conn.cursor()
        stmt = 'SELECT feed.owner_id, logs.action, logs.timestamp FROM logs INNER JOIN feed ON \
            logs.interact_to_feed_id = feed.id WHERE logs.user_id = %s'
        value = (current_user, )
        cursor.execute(stmt, value)
        for user in cursor.fetchall():
            time = current - int(float(user[2]))
            if current_user == user[0]:
                continue
            if user[0] not in affinity.keys():
                affinity[user[0]] = actionScore(0,user[1],time)
            else:
                old_score = affinity[user[0]]
                affinity[user[0]] = actionScore(old_score,user[1],time)
        cursor.close()
        return affinity

    async def get_news_feed(self, current_user, page, **kwargs):
        try:
            cursor = self.app.mysql_conn.cursor(buffered=True)
            stmt = 'SELECT feed.id, feed.type, feed.content, accounts.id, accounts.first_name, accounts.last_name, \
                feed.timestamp, GROUP_CONCAT(logs.action) FROM userfeed INNER JOIN feed ON feed.id=userfeed.feed_id \
                INNER JOIN accounts ON feed.owner_id=accounts.id LEFT JOIN logs ON feed.id=logs.interact_to_feed_id\
                 WHERE userfeed.user_id = %s GROUP BY feed.id'
            value = (current_user,) 
            cursor.execute(stmt, value)
            news_feed = [ generate_news_feed(feed) for feed in cursor.fetchall() ]
            all_feed_id = [ nf['id'] for nf in news_feed ]
            format_strings = ','.join(['%s'] * len(all_feed_id))
            stmt = 'SELECT interact_to_feed_id, action FROM logs WHERE user_id = %s AND \
                interact_to_feed_id in ({})'.format(format_strings)
            value = (current_user, *tuple(all_feed_id))
            try:
                cursor.execute(stmt, value)
                actions = { k:v for k, v in cursor.fetchall()}
            except:
                actions = {}
            for nf in news_feed:
                if nf['id'] in actions:
                    nf.update({'isLike':actions[nf['id']].strip().lower() == 'like',
                    'isLove':actions[nf['id']].strip().lower() == 'dislike'})
                else:
                    nf.update({'isLike':False, 'isLove':False})
            cursor.close()
            affinity = self.affinity(current_user)
            affinity.update({k:float('-inf') for k in \
                [e['owner_id'] for e in news_feed] if k not in affinity.keys()})
            news_feed.sort(key=lambda param: affinity[param['owner_id']])
            return {'news_feed':news_feed[(page-1)*10:page*10]}
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
            feed_id = cursor.lastrowid
            stmt = 'INSERT INTO userfeed (user_id, feed_id) SELECT from_user_id, %s\
                 FROM friends WHERE to_user_id = %s'
            value = (feed_id, current_user)
            cursor.execute(stmt, value)
            stmt = 'INSERT INTO userfeed (user_id, feed_id) VALUES (%s, %s)'
            value = (current_user, feed_id)
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

#def actionScore(old_score,action,t):
#   score = 0
#   if action == "like":
#       score = 2
#   if action == "love":
#       score = 3
#   u = max(old_score, t)
#   v = min(old_score, t)
#   return (u + math.log(math.exp(v-u))) * score

#def affinity(self):
#    affinity = dict()
#    getUser(self, affinityList)
#    cursor = self.app.mysql_conn.cursor()
#    stmt = 'SELECT friends.to_user_id, logs.user_id, logs.action, logs.timestamp FROM friends JOIN logs ON friends.from_user_id = logs.user_id'
#    cursor.execute(stmt)
#    userList = cursor.fetchall()
#    for user in userList:
#       if user[0] not in affinity.keys():
#           affinity[user[0]] = {user[1]:actionScore(0,user[2],user[3])}
#       else:
#           if user[1] not in affinity[user[0]].keys():
#               affinity[user[0]][user[1]] = actionScore(0,user[2],user[3])
#           else:
#               old_score = affinity[user[0]][user[1]]
#               affinity[user[0]][user[1]] = actionScore(old_score,user[2],user[3])
#     cursor.close()