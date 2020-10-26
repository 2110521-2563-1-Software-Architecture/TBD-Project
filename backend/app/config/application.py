from aiomysql import connect
from asyncio import get_event_loop
from app.config.settings import SETTINGS
from app.config.routes import map_routes

async def startup(app):
    app.mysql_conn = await connect(host=SETTINGS['mysql']['host'], 
    port=int(SETTINGS['mysql']['port']), user=SETTINGS['mysql']['user'], 
    password=SETTINGS['mysql']['password'], db=SETTINGS['mysql']['db'], 
    loop=get_event_loop())

async def cleanup(app):
    app.mysql_conn.close()

def app_config(app):
    app.on_startup.append(startup)
    app.on_cleanup.append(cleanup)
    map_routes(app)
    return app
