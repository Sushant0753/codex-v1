from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime

class Submission(BaseModel):
    id: Optional[str] = Field(alias="_id")
    code: str
    fullCode: str
    language: str
    status: str
    runtime: Optional[int]
    memory: Optional[int]
    testResults: Optional[Any]  # could be List[dict], depends on your structure

    userId: str
    problemId: str
    contestEntryId: Optional[str]

    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]
