from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from schemas.auth import LoginRequest, TokenResponse, RegisterRequest, RegisterResponse, VerifyCodeRequest
from utils.hash import verify_password, hash_password
from utils.jwt import create_access_token
from database.connection import db
from datetime import datetime 
from bson.objectid import ObjectId

router = APIRouter()

@router.post("/register", response_model=RegisterResponse)
async def register_user(payload: RegisterRequest):
    existing_user = await db["users"].find_one({
        "$or": [{"email": payload.email}, {"username": payload.username}]
    })
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or username already exists")

    hashed_pw = hash_password(payload.password)

    new_user = {
        "email": payload.email,
        "username": payload.username,
        "name": payload.name,
        "password": hashed_pw,
        "isVerified": False,
        "rank": 0,
        "rating": 1200,
        "currentStreak": 0,
        "longestStreak": 0,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }

    await db["users"].insert_one(new_user)

    return RegisterResponse(message="User registered successfully")


@router.post("/login", response_model=TokenResponse)
async def login_user(payload: LoginRequest):
    user = await db['users'].find_one({"email": payload.email})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    access_token = create_access_token({"sub": user["_id"]})
    
    return TokenResponse(access_token=access_token)





@router.post("/verify-code")
async def verify_code(payload: VerifyCodeRequest):
    try:
        user = db["users"].find_one({
            "email": payload.email.lower(),
            "verifyCode": payload.verifyCode,
            "verifyCodeExpiry": { "$gt": datetime.utcnow() }
        })

        if not user:
            raise HTTPException(status_code=400, detail="Invalid or expired verification code")

        db["users"].update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "isVerified": True,
                    "verifyCode": "",
                    "verifyCodeExpiry": None
                }
            }
        )

        return { "success": True, "message": "Email verified successfully. You can now sign in." }

    except Exception as e:
        print("Error verifying email:", e)
        raise HTTPException(status_code=500, detail="Error verifying email")
