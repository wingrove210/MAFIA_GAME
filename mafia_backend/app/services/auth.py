from db.models import User  # Assuming you have a User SQLAlchemy model
from sqlalchemy.orm import Session

def create_user(email: str, username: str, hashed_password: str):
    # db: Session should be passed in real code
    user = User(email=email, username=username, hashed_password=hashed_password)
    # db.add(user)
    # db.commit()
    # db.refresh(user)
    return user

def get_user_by_username(username: str):
    # db: Session should be passed in real code
    # return db.query(User).filter(User.username == username).first()
    return None  # Replace with actual DB lookup