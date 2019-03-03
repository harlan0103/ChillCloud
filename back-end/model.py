# This file creates the RESTful API
from peewee import *

db = SqliteDatabase('mydb.db', pragmas=(('foreign_keys', 'on'),))

# Create a database named my.db
class BaseModel(Model):
    class Meta:
        database = db

# Add table named Folder
class Folder(BaseModel):
    name = CharField(max_length = 64, unique = True)

def create_all_tables():
    db.connect()
    db.create_tables([Folder])

if __name__ == '__main__':
    create_all_tables()
