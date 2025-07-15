from motor.motor_asyncio import AsyncIOMotorClient
from config.config import MONGO_URI, DATABASE_NAME

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]

# Example usage:
# users_collection = db['users']
# problems_collection = db['problems']
