import pymongo
from pymongo.server_api import ServerApi
from pymongo.database import Database
from core.config import settings

mongo_client = pymongo.MongoClient(f"mongodb+srv://{settings.mongo_user}:{settings.mongo_password}@mongoapp.wbti8bh.mongodb.net/{settings.mongo_db}?appName=MongoAPP", server_api=ServerApi('1'))

try:
    mongo_client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

def get_db() -> Database:
    return mongo_client['survey']