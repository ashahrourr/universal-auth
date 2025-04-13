from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from fastapi import Request
from app.utils.auth import get_current_user
from fastapi import Depends
from fastapi.responses import HTMLResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "super-secret-key"
REFRESH_SECRET = "refresh-secret-key"
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

class TokenRequest(BaseModel):
    refresh_token: str

class LoginPayload(BaseModel):
    device_id: str

@app.post("/auth/login")
def login(data: LoginPayload):
    user_id = data.device_id

    access_token = jwt.encode({
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }, SECRET_KEY, algorithm=ALGORITHM)

    refresh_token = jwt.encode({
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    }, REFRESH_SECRET, algorithm=ALGORITHM)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }


@app.post("/auth/refresh")
def refresh_token(data: TokenRequest):
    try:
        payload = jwt.decode(data.refresh_token, REFRESH_SECRET, algorithms=[ALGORITHM])
        user_id = payload["sub"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    new_access_token = jwt.encode({
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }, SECRET_KEY, algorithm=ALGORITHM)

    return { "access_token": new_access_token }

class EmailPayload(BaseModel):
    user_id: str
    email: str

user_emails = {}

@app.post("/auth/email")
def store_email(payload: EmailPayload):
    user_emails[payload.user_id] = payload.email
    return { "status": "ok", "email": payload.email }


@app.get("/auth/protected")
def protected_route(user_id: str = Depends(get_current_user)):
    return { "message": f"Hello {user_id}, you accessed a protected route!" }

@app.get("/")
def root():
    return ("root")