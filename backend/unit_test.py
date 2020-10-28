import requests, mysql.connector
from jwt import decode, encode
from dotenv import load_dotenv
from os import getenv

load_dotenv()

URL = 'http://localhost:8080/'
SECRET = getenv('SECRET')

def register(account_id, first_name, last_name, pwd, birth_date, gender):
    r = requests.post(URL+'register', json={
        'account_id':account_id,
        'first_name':first_name,
        'last_name':last_name,
        'pwd':pwd,
        'birth_date':birth_date,
        'gender':gender
    })
    return r.json()['status']

def login(account_id, pwd):
    r = requests.post(URL+'login', json={'account_id':account_id, 'pwd':pwd})
    return r.json()

def post_friend(current_user, target_user):
    r = requests.post(URL+'friend', json={'target':target_user}, headers={'User':current_user})
    return r.json()['status']

def get_friend(current_user):
    r = requests.get(URL+'friend', headers={'User':current_user})
    return r.json()['friends']

def post_feed(current_user, content, content_type):
    r = requests.post(URL+'feed', json={'content':content,
    'content_type':content_type}, headers={'User':current_user})
    return r.json()['status']

def get_feed(current_user):
    r = requests.get(URL+'feed', headers={'User':current_user})
    return r.json()['news_feed']

def patch_feed(current_user, target, content, content_type):
    r = requests.patch(URL+'feed', json={'target':target, 'content':content,
    'content_type':content_type}, headers={'User':current_user})
    return r.json()['status']

def delete_feed(current_user, target):
    r = requests.delete(URL+'feed', 
    headers={'target':str(target), 'User':current_user})
    return r.json()['status']        

def interact(current_user, target, action):
    r = requests.post(URL+'interact', json={'target':target, 
    'action':action}, headers={'User':current_user})
    return r.json()['status']

EMAIL1 = 'a@email.com'
FIRST1 = 'first1'
LAST1 = 'last1'

EMAIL2 = 'b@email.com'
FIRST2 = 'first2'
LAST2 = 'last2'

PASSWORD = '123456789'
BIRTHDATE = '1/1/2016'
GENDER = 'male'

register1 = register(EMAIL1, FIRST1, LAST1, PASSWORD, BIRTHDATE, GENDER)
register2 = register(EMAIL2, FIRST2, LAST2, PASSWORD, BIRTHDATE, GENDER)
login1 = login(EMAIL1, PASSWORD)
login2 = login(EMAIL2, PASSWORD)

DATABASE_NAME = getenv('DB_DATABASE')
HOST = getenv('DB_HOST')
USER = getenv('DB_USERNAME')
PASSWORD = getenv('DB_PASSWORD')

mydb = mysql.connector.connect(
host=HOST,
user=USER,
password=PASSWORD,
database=DATABASE_NAME
)

mycursor = mydb.cursor()
mycursor.execute('SET FOREIGN_KEY_CHECKS=0')
mycursor.execute('INSERT INTO userfeed (user_id, feed_id) VALUES (%s, %s)', (2,1))
mycursor.execute('INSERT INTO userfeed (user_id, feed_id) VALUES (%s, %s)', (2,2))
mycursor.execute('INSERT INTO userfeed (user_id, feed_id) VALUES (%s, %s)', (2,3))
mydb.commit()
mycursor.execute('SET FOREIGN_KEY_CHECKS=1') 
mycursor.close()
mydb.close() 

import unittest

class TestMethods(unittest.TestCase):

    def test_register(self):
        self.assertEqual(register1, 'success.')
        self.assertEqual(register2, 'success.')
        self.assertEqual(register(EMAIL1, FIRST1, LAST1, PASSWORD, BIRTHDATE, GENDER), 'already registered.')
        self.assertNotEqual(register('', FIRST1, LAST1, PASSWORD, BIRTHDATE, GENDER), 'success.')

    def test_login(self):
        self.assertEqual(login1['status'], 'success.')
        self.assertEqual(login2['status'], 'success.')
        self.assertEqual(login(EMAIL1, '')['status'], 'incorrect id or password.')
        self.assertEqual(login('', PASSWORD)['status'], 'incorrect id or password.')
        self.assertEqual(login('', '')['status'], 'incorrect id or password.')         

    def test_make_friend(self):         
        add_friend = post_friend(login1['token'], 2)
        friends = get_friend(login1['token'])
        self.assertEqual(add_friend, 'success.')  
        self.assertNotEqual(friends, [])
        post_friend(login1['token'], 2)
        self.assertEqual(get_friend(login1['token']), [])

    def test_add_feed(self):
        self.assertEqual(post_feed(login1['token'], 'content1', 'message'), 'success.')
        self.assertEqual(post_feed(login1['token'], 'content2', 'message'), 'success.')
        self.assertEqual(post_feed(login1['token'], 'content3', 'message'), 'success.')

    def test_get_news_feed(self): 
        news_feed = get_feed(login2['token'])
        self.assertNotEqual(news_feed, [])
        self.assertEqual(get_feed(login1['token']), [])

    def test_update_feed(self):
        old_news_feed = get_feed(login2['token'])
        self.assertEqual(patch_feed(login1['token'], 1, 'edit1', 'string'), 'success.')
        self.assertEqual(patch_feed(login1['token'], 2, 'edit2', 'picture'), 'success.')
        news_feed = get_feed(login2['token'])
        self.assertNotEqual(news_feed, old_news_feed)
        old_news_feed = news_feed
        patch_feed(login1['token'], 1000, 'error', 'string')
        news_feed = get_feed(login2['token'])
        self.assertEqual(news_feed, old_news_feed)

    def test_delete_feed(self):
        old_news_feed = get_feed(login2['token'])
        self.assertEqual(delete_feed(login1['token'], 1), 'success.')
        news_feed = get_feed(login2['token'])
        self.assertNotEqual(news_feed, old_news_feed)
        old_news_feed = news_feed
        delete_feed(login1['token'], 4)
        self.assertEqual(news_feed, old_news_feed)

    def test_interact(self):
        self.assertEqual(interact(login1['token'], 2, 'like'), 'success.')
        self.assertEqual(interact(login1['token'], 2, 'dislike'), 'success.')
        self.assertEqual(interact(login1['token'], 3, 'like'), 'success.')
        self.assertNotEqual(interact(login1['token'], 1, 'like'), 'success.')
        
if __name__ == '__main__':
    unittest.main()