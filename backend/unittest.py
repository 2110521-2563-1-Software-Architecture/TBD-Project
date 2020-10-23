import requests, mysql.connector
from jwt import decode, encode
from dotenv import load_dotenv
from os import getenv

load_dotenv()

URL = 'http://localhost:8080/'
SECRET = getenv('SECRET')

def register(account_id, first_name, last_name, pwd, birth_date, gender):
    token = encode({'a':'a'}, SECRET, algorithm='HS256').decode('utf-8')
    r = requests.post(URL+'register', json={
        'account_id':account_id,
        'first_name':first_name,
        'last_name':last_name,
        'pwd':pwd,
        'birth_date':birth_date,
        'gender':gender
    }, headers={'Authorization':token})
    return r.json()['status']

def login(account_id, pwd):
    token = encode({'a':'a'}, SECRET, algorithm='HS256').decode('utf-8')
    r = requests.post(URL+'login', json={'account_id':account_id,
    'pwd':pwd}, headers={'Authorization':token})
    return r.json()

def post_friend(current_user, target_user):
    token = encode({'a':'a'}, SECRET, algorithm='HS256').decode('utf-8')
    r = requests.post(URL+'friend', json={'target':target_user}, headers={'Authorization':token, 'User':current_user})
    return r.json()['status']

def get_friend(current_user):
    token = encode({'a':'a'}, SECRET, algorithm='HS256').decode('utf-8')
    r = requests.get(URL+'friend', headers={'Authorization':token, 'User':current_user})
    return r.json()['friends']

def post_feed(current_user, content, content_type):
    token = encode({'a':'a'}, SECRET, algorithm='HS256').decode('utf-8')
    r = requests.post(URL+'feed', json={'content':content,
    'content_type':content_type}, headers={'Authorization':token, 'User':current_user})
    return r.json()['status']

def get_feed(current_user):
    token = encode({'a':'a'}, SECRET, algorithm='HS256').decode('utf-8')
    r = requests.get(URL+'feed', headers={'Authorization':token, 'User':current_user})
    return r.json()['news_feed']

def patch_feed(current_user, target, content, content_type):
    token = encode({'a':'a'}, SECRET, algorithm='HS256').decode('utf-8')
    r = requests.patch(URL+'feed', json={'target':target, 'content':content,
    'content_type':content_type}, headers={'Authorization':token, 'User':current_user})
    return r.json()['status']

def delete_feed(current_user, target):
    token = encode({'a':'a'}, SECRET, algorithm='HS256').decode('utf-8')
    r = requests.delete(URL+'feed', json={'target':target}, 
    headers={'Authorization':token, 'User':current_user})
    return r.json()['status']        

def interact(current_user, target, action):
    token = encode({'a':'a'}, SECRET, algorithm='HS256').decode('utf-8')
    r = requests.post(URL+'interact', json={'target':target, 
    'action':action}, headers={'Authorization':token, 'User':current_user})
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

# Test Register
print(register1=='success.')
print(register2=='success.')
print(register(EMAIL1, FIRST1, LAST1, PASSWORD, BIRTHDATE, GENDER) \
    =='already registered.')
try:
    register('', FIRST1, LAST1, PASSWORD, BIRTHDATE, GENDER)
except Exception as err:
    print(True, err)

# Test Login
print(login1['status']=='success.')
print(login2['status']=='success.')
print(login(EMAIL1, '')['status'] =='incorrect id or password.')
print(login('', PASSWORD)['status'] =='incorrect id or password.')
print(login('', '')['status'] =='incorrect id or password.')

# Test Add/Remove Friend
add_friend = post_friend(login1['token'], 2)
friends = get_friend(login1['token'])
print(add_friend == 'success.')
print(friends != [], friends)
unfriend = post_friend(login1['token'], 2)
try:
    get_friend(login1['token'])
except Exception as err:
    print(True, err)

# Test Add News Feed
print('success.' == post_feed(login1['token'], 'content1', 'message'))
print('success.' == post_feed(login1['token'], 'content2', 'message'))
print('success.' == post_feed(login1['token'], 'content3', 'picture'))

# ---------------------------------------------------------------------

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
mycursor.execute('INSERT INTO userfeed (user_id, feed_id) VALUES (%s, %s)', (2,1))
mycursor.execute('INSERT INTO userfeed (user_id, feed_id) VALUES (%s, %s)', (2,2))
mycursor.execute('INSERT INTO userfeed (user_id, feed_id) VALUES (%s, %s)', (2,3))
mydb.commit()

# Test Get News Feed
news_feed = get_feed(login2['token'])
print(news_feed != [], news_feed)
try:
    get_feed(login1['token'])
except Exception as err:
    print(True, err)

# Test Update Feed
old_news_feed = news_feed
print(patch_feed(login1['token'], 1, 'edit1', 'string') == 'success.')
print(patch_feed(login1['token'], 2, 'edit2', 'picture') == 'success.')
news_feed = get_feed(login2['token'])
print(news_feed != old_news_feed, news_feed)
try:
    patch_feed(login1['token'], 1000, 'error', 'string')
except Exception as err:
    print(True, err)

# Test Delete Feed
old_news_feed = news_feed
print(delete_feed(login1['token'], 1) == 'success.')
news_feed = get_feed(login2['token'])
print(news_feed != old_news_feed, news_feed)
try:
    delete_feed(login1['token'], 4)
except Exception as err:
    print(True, err)

# Test Like/Dislike
print(interact(login1['token'], 2, 'like') == 'success.')
print(interact(login1['token'], 2, 'dislike') == 'success.')
print(interact(login1['token'], 3, 'like') == 'success.')
try:
    interact(login1['token'], 1, 'like')
except Exception as err:
    print(True, err)