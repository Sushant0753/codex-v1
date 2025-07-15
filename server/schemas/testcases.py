from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TestCase(BaseModel):
    id: Optional[str] = Field(alias="_id")
    input: str
    output: str
    isHidden: bool = False
    explanation: Optional[str]
    problemId: str
    difficulty: str

    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]
