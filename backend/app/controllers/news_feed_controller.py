from app.controllers.base import Controller
from app.models.news_feed import NewsFeed
from app.models.user import User
import json

class NewsFeedController(Controller):

    async def get(self, request):
        try:
            current_user = await User(request.app).get_user(request.headers.get('User'))
            response = await NewsFeed(request.app).get_news_feed(current_user,
            json.loads(request.headers.get('page')))
            await self.write(request, self.json_response(response))
        except:
            response = {'status':'Bad Request.', 'reason':'Controller rejected.'}
            await self.write(request, self.json_response(response))            

    async def create(self, request):
        try:
            payload = await request.json()
            current_user = await User(request.app).get_user(request.headers.get('User'))
            response = await NewsFeed(request.app).create(current_user, **payload)
            await self.write(request, self.json_response(response))
        except:
            response = {'status':'Bad Request.', 'reason':'Controller rejected.'}
            await self.write(request, self.json_response(response))

    async def update(self, request):
        try:
            payload = await request.json()
            current_user = await User(request.app).get_user(request.headers.get('User'))
            response = await NewsFeed(request.app).update(current_user, **payload)
            await self.write(request, self.json_response(response))
        except:
            response = {'status':'Bad Request.', 'reason':'Controller rejected.'}
            await self.write(request, self.json_response(response))

    async def delete(self, request):
        try:
            current_user = await User(request.app).get_user(request.headers.get('User'))
            news_feed_id = request.headers.get('target')
            response = await NewsFeed(request.app).delete(current_user, news_feed_id)
            await self.write(request, self.json_response(response))        
        except:
            response = {'status':'Bad Request.', 'reason':'Controller rejected.'}
            await self.write(request, self.json_response(response))

    async def interact(self, request):
        try:
            payload = await request.json()
            current_user = await User(request.app).get_user(request.headers.get('User'))
            response = await NewsFeed(request.app).interact(current_user, **payload)
            await self.write(request, self.json_response(response)) 
        except:
            response = {'status':'Bad Request.', 'reason':'Controller rejected.'}
            await self.write(request, self.json_response(response))