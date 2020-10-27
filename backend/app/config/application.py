from mysql.connector import connect
from app.config.settings import SETTINGS
from app.config.routes import map_routes

async def startup(app):
    app.mysql_conn = connect(
        host=SETTINGS['mysql']['host'],
        user=SETTINGS['mysql']['user'],
        password=SETTINGS['mysql']['password'],
        database=SETTINGS['mysql']['db']
        )


async def cleanup(app):
    app.mysql_conn.close()

def app_config(app):
    app.on_startup.append(startup)
    app.on_cleanup.append(cleanup)
    map_routes(app)
    return app
