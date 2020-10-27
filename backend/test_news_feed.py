from dotenv import load_dotenv
from os import getenv

load_dotenv()

DATABASE_NAME = getenv('DB_DATABASE')
HOST = getenv('DB_HOST')
USER = getenv('DB_USERNAME')
PASSWORD = getenv('DB_PASSWORD')
PORT = int(getenv('DB_PORT'))
SECRET = getenv('SECRET')

import mysql.connector

mydb = mysql.connector.connect(
  host=HOST,
  user=USER,
  password=PASSWORD,
  database=DATABASE_NAME
)

mycursor = mydb.cursor()
mycursor.execute('DELETE FROM userfeed')

mycursor.execute('SELECT id FROM feed')
feed = mycursor.fetchall()

mycursor.execute('SELECT id FROM accounts')
accounts = mycursor.fetchall()

for u in accounts:
  for f in feed:
    mycursor.execute('INSERT INTO userfeed (user_id, feed_id) VALUEs (%s, %s)', (u[0], f[0]))
mydb.commit()
print('done :)')