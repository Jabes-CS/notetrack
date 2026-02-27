from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.grades import router as grades_router

app = FastAPI(title="NoteTrack API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(grades_router, prefix="/api", tags=["Grades"])

@app.get("/")
async def root():
    return {"message": "NoteTrack API rodando!"}