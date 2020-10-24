from app.controllers.base import Controller
from app.models.user import User

class UserController(Controller):

    async def login(self, request):
        try:
            payload = await request.json()
            response = await User(request.app).login(**payload)
            await self.write(request, self.json_response(response))
        except:
            response = {'status':'Bad Request.', 'reason':'Unknown Error.'}
            await self.write(request, self.json_response(response))

    async def register(self, request):
        try:
            payload = await request.json()
            response = await User(request.app).register(**payload)
            await self.write(request, self.json_response(response))
        except:
            response = {'status':'Bad Request.', 'reason':'Unknown Error.'}
            await self.write(request, self.json_response(response))            

    async def get_friend(self, request):
        try:
            current_user = await User(request.app).get_user(request.headers.get('User'))
            response = await User(request.app).get_friend(current_user)
            await self.write(request, self.json_response(response))
        except:
            response = {'status':'Bad Request.', 'reason':'Unknown Error.'}
            await self.write(request, self.json_response(response))

    async def make_friend(self, request):
        try:
            payload = await request.json()
            current_user = await User(request.app).get_user(request.headers.get('User'))
            response = await User(request.app).make_friend(current_user, **payload)
            await self.write(request, self.json_response(response))     
        except:
            response = {'status':'Bad Request.', 'reason':'Unknown Error.'}
            await self.write(request, self.json_response(response))