from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from core.auth_logic import register_user, authenticate_user, create_access_token

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
def register(data: RegisterRequest):
    user = register_user(email=data.email, username=data.username, password=data.password)
    if not user:
        raise HTTPException(status_code=400, detail="User already exists")
    access_token = create_access_token(data={"sub": user.username})
    return TokenResponse(access_token=access_token)

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest):
    user = authenticate_user(username=data.username, password=data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.username})
    return TokenResponse(access_token=access_token)