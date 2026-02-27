from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from database import users_collection
from models.user import UserRegister, UserLogin
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY")

def create_token(email: str):
    expire = datetime.utcnow() + timedelta(days=30)
    return jwt.encode({"sub": email, "exp": expire}, SECRET_KEY, algorithm="HS256")

def build_semesters(count: int):
    return [
        {
            "id": f"sem_{i}",
            "label": f"{i}º Semestre",
            "subjects": []
        }
        for i in range(1, count + 1)
    ]

@router.post("/register")
async def register(user: UserRegister):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    hashed = pwd_context.hash(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed,
        "course": {
            "name": user.course_name,
            "semesters": build_semesters(user.semester_count)
        }
    }
    await users_collection.insert_one(new_user)
    token = create_token(user.email)
    return {
        "token": token,
        "name": user.name,
        "course": new_user["course"]
    }

@router.post("/login")
async def login(user: UserLogin):
    found = await users_collection.find_one({"email": user.email})
    if not found:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    if not pwd_context.verify(user.password, found["password"]):
        raise HTTPException(status_code=401, detail="Senha incorreta")

    token = create_token(user.email)
    return {
        "token": token,
        "name": found["name"],
        "course": found["course"]
    }