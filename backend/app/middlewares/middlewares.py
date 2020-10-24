from app.middlewares.jwt_authen import jwt_middleware

MIDDLEWARES = [
    jwt_middleware,
]