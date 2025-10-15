from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional
import re
from jose import JWTError, jwt

from app.database import get_db
from app.models.models import User, UserRole
from app.schemas.schemas import User as UserSchema, UserCreate, Token
from app.core.config import settings

# ✅ Reemplazamos bcrypt/argon2 por sha256_crypt (sin límite de bytes)
from passlib.hash import sha256_crypt

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")

# ------------------------------------------------------
# Funciones auxiliares
# ------------------------------------------------------
def validate_password_strength(password: str):
    """Valida que la contraseña tenga al menos una mayúscula, un número y un carácter especial."""
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 8 caracteres.")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=400, detail="La contraseña debe contener al menos una letra mayúscula.")
    if not re.search(r"\d", password):
        raise HTTPException(status_code=400, detail="La contraseña debe contener al menos un número.")
    if not re.search(r"[@$!%*?&._\\-#]", password):
        raise HTTPException(status_code=400, detail="La contraseña debe contener al menos un carácter especial.")

def get_password_hash(password: str) -> str:
    """Hashea la contraseña usando sha256_crypt."""
    validate_password_strength(password)
    return sha256_crypt.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si la contraseña ingresada coincide con el hash almacenado."""
    try:
        return sha256_crypt.verify(plain_password, hashed_password)
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Crea un token JWT con expiración."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Obtiene el usuario actual a partir del token JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin(current_user: User = Depends(get_current_user)):
    """Verifica si el usuario es administrador."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Acceso solo para administradores")
    return current_user

# ------------------------------------------------------
# Rutas de autenticación
# ------------------------------------------------------
@router.post("/register", response_model=UserSchema)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Registra un nuevo usuario."""
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")
    
    raw_password = (
        user.password.get_secret_value() if hasattr(user.password, "get_secret_value") else user.password
    )
    hashed_password = get_password_hash(raw_password)

    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        preferred_language=user.preferred_language,
        role=UserRole.USER
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Autentica al usuario y devuelve un token JWT."""
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Devuelve los datos del usuario autenticado."""
    return current_user
