from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class User(BaseModel):
    id: Optional[str] = Field(alias="_id")
    email: EmailStr
    name: str
    username: str
    password: str
    avatarUrl: Optional[str]
    bio: Optional[str]
    verifyCode: Optional[str]
    verifyCodeExpiry: Optional[datetime]
    isVerified: bool = False

    rank: int
    rating: int
    currentStreak: int
    longestStreak: int
    lastSolvedAt: Optional[datetime]
    githubUsername: Optional[str]
    website: Optional[str]
    location: Optional[str]

    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
