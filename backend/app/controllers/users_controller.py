from app.controllers.base import Controller
from app.models.user import User


class UserController(Controller):

    async def login(self, request):
        try:
            payload = await request.json()
            response = await User(request.app).login(**payload)
            await self.write(request, self.json_response(response))
        except:
            response = {'status': 'Bad Request.',
                        'reason': 'Controller rejected. Please check input.'}
            await self.write(request, self.json_response(response))

    async def logout(self, request):
        try:
            current_user = await User(request.app).get_user(request.headers.get('User'))
            response = await User(request.app).logout(current_user, request.headers.get('User'))
            await self.write(request, self.json_response(response))
        except:
            response = {'status': 'Bad Request.',
                        'reason': 'Controller rejected. Please check input.'}
            await self.write(request, self.json_response(response))

    async def register(self, request):
        try:
            payload = await request.json()
            response = await User(request.app).register(**payload)
            await self.write(request, self.json_response(response))
        except:
            response = {'status': 'Bad Request.',
                        'reason': 'Controller rejected. Please check input.'}
            await self.write(request, self.json_response(response))

    async def get_user_data(self, request):
        try:
            current_user = await User(request.app).get_user(request.headers.get('User'))
            response = await User(request.app).get_user_data(current_user)
            await self.write(request, self.json_response(response))
        except:
            response = {'status': 'Bad Request.',
                        'reason': 'Controller rejected. Please check input.'}
            await self.write(request, self.json_response(response))

    async def get_all_users(self, request):
        try:
            response = await User(request.app).get_all_users()
            await self.write(request, self.json_response(response))
        except:
            response = {'status': 'Bad Request.',
                        'reason': 'Controller rejected. Please check input.'}
            await self.write(request, self.json_response(response))

    async def get_friend(self, request):
        try:
            current_user = await User(request.app).get_user(request.headers.get('User'))
            response = await User(request.app).get_friend(current_user)
            await self.write(request, self.json_response(response))
        except:
            response = {'status': 'Bad Request.',
                        'reason': 'Controller rejected. Please check input.'}
            await self.write(request, self.json_response(response))

    async def make_friend(self, request):
        try:
            payload = await request.json()
            current_user = await User(request.app).get_user(request.headers.get('User'))
            response = await User(request.app).make_friend(current_user, **payload)
            await self.write(request, self.json_response(response))
        except:
            response = {'status': 'Bad Request.',
                        'reason': 'Controller rejected. Please check input.'}
            await self.write(request, self.json_response(response))
