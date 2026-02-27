from pydantic import BaseModel, EmailStr
from typing import List, Optional

class Assessment(BaseModel):
    id: str
    name: str
    weight: float
    grade: Optional[float] = None

class Subject(BaseModel):
    id: str
    name: str
    assessments: List[Assessment] = []

class Semester(BaseModel):
    id: str
    label: str
    subjects: List[Subject] = []

class Course(BaseModel):
    name: str
    semesters: List[Semester] = []

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    course_name: str
    semester_count: int

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    course: Course