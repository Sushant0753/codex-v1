import jwt
from datetime import datetime, timedelta
from bson import ObjectId
import json

SECRET_KEY = "qwertyuiop"
ALGORITHM = "HS256"

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode, 
        SECRET_KEY, 
        algorithm=ALGORITHM,
        json_encoder=JSONEncoder
    )
