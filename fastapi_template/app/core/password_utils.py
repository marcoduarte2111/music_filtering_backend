import re
from passlib.hash import sha256_crypt
from fastapi import HTTPException

def validate_password_strength(password: str):
    """Valida que la contraseña tenga al menos una mayúscula, un número y un carácter especial."""
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 8 caracteres.")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=400, detail="Debe contener al menos una letra mayúscula.")
    if not re.search(r"\d", password):
        raise HTTPException(status_code=400, detail="Debe contener al menos un número.")
    if not re.search(r"[@$!%*?&._\\-#]", password):
        raise HTTPException(status_code=400, detail="Debe contener al menos un carácter especial.")

def hash_password(password: str) -> str:
    validate_password_strength(password)
    return sha256_crypt.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return sha256_crypt.verify(plain_password, hashed_password)
    except Exception:
        return False
