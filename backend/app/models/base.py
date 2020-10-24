class BaseModel(object):

    def __init__(self, app):
        self.app = app

    def __getattribute__(self, name):
        try:
            return object.__getattribute__(self, name)
        except AttributeError:
            return object.__getattribute__(self.collection, name)