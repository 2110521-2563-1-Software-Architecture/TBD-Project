from os import getenv
from dotenv import load_dotenv

load_dotenv()

SETTINGS = {
    'mysql': {
        'host': getenv('DB_HOST'),
        'user': getenv('DB_USERNAME'),
        'password':getenv('DB_PASSWORD'),
        'db':getenv('DB_DATABASE'),
        'port':getenv('DB_PORT')
    },
}
