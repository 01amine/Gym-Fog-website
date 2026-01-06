from enum import Enum
from beanie import Document
from pydantic import BaseModel, Field, EmailStr, field_validator
from datetime import datetime
from typing import Optional, List


class Role(str, Enum):
    USER = "user"
    ADMIN = "admin"
    Super_Admin = "super_admin"


class User(Document):
    email: EmailStr = Field(unique=True)
    hashed_password: str
    isblocked : bool = False
    full_name: Optional[str]
    phone_number: Optional[str]
    roles: List[Role] = Field(default_factory=lambda: [Role.USER])  
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(BaseModel):
    email : str
    full_name: str
    phone_number: str
    password: str
    
    
class UserLogin(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    
class ResetPasswordRequest(BaseModel):
    email: str
    code: str
    new_password: str
    

class VerifyCodeRequest(BaseModel):
    email: str
    code: str
    
    
class UserUpdate(BaseModel):
    email : str|None = None
    full_name: str|None = None
    phone_number: str|None = None
    password: str|None = None