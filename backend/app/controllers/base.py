from aiohttp.web import json_response

class Controller:

    @staticmethod
    def json_response(data, *args, **kwargs):
        return json_response(data, *args, **kwargs)

    @staticmethod
    async def write(req, response):
        await response.prepare(req)
        await response.write_eof()
