from app.controllers.users_controller import UserController
from app.controllers.news_feed_controller import NewsFeedController
from aiohttp_cors import setup, ResourceOptions

def map_routes(app):

    cors = setup(app, defaults={
        '*': ResourceOptions(
            allow_credentials=True,
            expose_headers='*',
            allow_headers='*',
        )
    })    

    user_controller = UserController()
    news_feed_controller = NewsFeedController()

    resource = app.router.add_resource('/login', name='login')
    resource.add_route('POST', user_controller.login)

    resource = app.router.add_resource('/register', name='register')
    resource.add_route('POST', user_controller.register)

    resource = app.router.add_resource('/user_data', name='user_data')
    resource.add_route('GET', user_controller.get_user_data)     

    resource = app.router.add_resource('/friend', name='friend')
    resource.add_route('GET', user_controller.get_friend)    
    resource.add_route('POST', user_controller.make_friend)

    resource = app.router.add_resource('/feed', name='news_feed')
    resource.add_route('GET', news_feed_controller.get)
    resource.add_route('POST', news_feed_controller.create)
    resource.add_route('PATCH', news_feed_controller.update)
    resource.add_route('DELETE', news_feed_controller.delete)

    resource = app.router.add_resource('/interact', name='interact')
    resource.add_route('POST', news_feed_controller.interact) 

    for route in app.router.routes():
        cors.add(route)