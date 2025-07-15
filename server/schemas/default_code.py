from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class DefaultCode(BaseModel):
    id: Optional[str] = Field(alias="_id")
    code: str
    language: str
    problemId: str

    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]
