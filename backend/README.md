# Fookbace Backend

## Setup and Run
### Python 3.8.6
```
pip install -r requirements.txt 
python main.py
```
### .env
```
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
```
## Register(POST) /register
### Payload
```
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
```
{
    'status':status
}
```
## Login(POST) /login
### Payload
```
{
    'account_id':account_id,
    'pwd':pwd
}
```
### Response
```
{
    'status':status,
    'token':access_token
}
```
## News Feed(POST) /feed
### Headers
```
{
    'User':access_token
}
```
### Payload
```
{
    'content_type':content_type,
    'content':content
}
```
### Response
```
{
    'status':status
}
```
## News Feed(GET) /feed
### Headers
```
{
    'User':access_token
}
```
### Response
```
{
    'news_feed':[news_feed, ...]
}
```
## News Feed(PATCH) /feed
### Headers
```
{
    'User':access_token
}
```
### Payload
```
{
    'target':feed_id,
    'content_type':content_type,
    'content':content
}
```
### Response
```
{
    'status':status
}
```
## News Feed(DELETE) /feed
### Headers
```
{
    'User':access_token,
    'target':feed_id
}
```
### Response
```
{
    'status':status
}
```
## Friend Add/Delete(POST) /friend
### Headers
```
{
    'User':access_token
}
```
### Payload
```
{
    'target':user_id
}
```
### Response
```
{
    'status':status
}
```
## Friend(GET) /friend
### Headers
```
{
    'User':access_token
}
```
### Response
```
{
    'friends':[friend, ...]
}
```
## Like/Dislike(POST) /interact
### Headers
```
{
    'User':access_token
}
```
### Payload
```
{
    'target':feed_id,
    'action':like or dislike
}
```
### Response
```
{
    'status':status
}
```