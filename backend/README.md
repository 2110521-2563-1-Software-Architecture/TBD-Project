# Fookbace Backend

## Setup and Run
### Python 3.8.6
```
pip install -r requirements.txt 
python server.py
```
### .env
```
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

SECRET=
```
## Register(POST) /register
### Headers
```json
{
    'Authorization':jwt_token
}
```
### Payload
```json
{
    'account_id':account_id,
    'first_name':first_name,
    'last_name':last_name,
    'pwd':pwd,
    'birth_date':birth_date,
    'gender':gender
}
```
### Response
```json
{
    'status':status
}
```
## Login(POST) /login
### Headers
```json
{
    'Authorization':jwt_token
}
```
### Payload
```json
{
    'account_id':account_id,
    'pwd':pwd
}
```
### Response
```json
{
    'status':status,
    'token':access_token
}
```
## News Feed(POST) /feed
### Headers
```json
{
    'Authorization':jwt_token,
    'User':access_token
}
```
### Payload
```json
{
    'content_type':content_type,
    'content':content
}
```
### Response
```json
{
    'status':status
}
```
## News Feed(GET) /feed
### Headers
```json
{
    'Authorization':jwt_token,
    'User':access_token
}
```
### Response
```json
{
    'news_feed':[news_feed, ...]
}
```
## News Feed(PATCH) /feed
### Headers
```json
{
    'Authorization':jwt_token,
    'User':access_token
}
```
### Payload
```json
{
    'target':feed_id,
    'content_type':content_type,
    'content':content
}
```
### Response
```json
{
    'status':status
}
```
## News Feed(DELETE) /feed
### Headers
```json
{
    'Authorization':jwt_token,
    'User':access_token
}
```
### Payload
```json
{
    'target':feed_id
}
```
### Response
```json
{
    'status':status
}
```
## Friend Add/Delete(POST) /friend
### Headers
```json
{
    'Authorization':jwt_token,
    'User':access_token
}
```
### Payload
```json
{
    'target':user_id
}
```
### Response
```json
{
    'status':status
}
```
## Friend(GET) /friend
### Headers
```json
{
    'Authorization':jwt_token,
    'User':access_token
}
```
### Response
```json
{
    'friends':[friend, ...]
}
```
## Like/Dislike(POST) /interact
### Headers
```json
{
    'Authorization':jwt_token,
    'User':access_token
}
```
### Payload
```json
{
    'target':feed_id,
    'action':like or dislike
}
```
### Response
```json
{
    'status':status
}
```