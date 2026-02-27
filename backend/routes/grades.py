from fastapi import APIRouter, HTTPException, Header
from jose import jwt, JWTError
from database import users_collection
from models.user import UserUpdate
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()
SECRET_KEY = os.getenv("SECRET_KEY")

def get_email_from_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

@router.get("/course")
async def get_course(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    email = get_email_from_token(token)
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {"course": user["course"]}

@router.put("/course")
async def update_course(data: UserUpdate, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    email = get_email_from_token(token)
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    await users_collection.update_one(
        {"email": email},
        {"$set": {"course": data.course.dict()}}
    )
    return {"message": "Salvo com sucesso"}