from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class Problem(BaseModel):
    id: Optional[str] = Field(alias="_id")
    title: str
    slug: str
    description: str
    difficulty: str
    timeLimit: Optional[int]
    memoryLimit: Optional[int]
    tags: List[str] = []
    companies: List[str] = []
    likes: int = 0
    dislikes: int = 0
    acceptanceRate: float = 0.0
    totalSubmissions: int = 0
    successfulSubmissions: int = 0
    premium: bool = False
    solved: bool = False

    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]
