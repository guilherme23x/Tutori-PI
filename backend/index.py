from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

# Configuração da conexão Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    # Retorno de fallback para desenvolvimento local
    supabase = None

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lucas deve definir a classe Mentor aqui (Parte 2)

# Rota principal de busca com lógica de filtros
@app.get("/api/mentors")
def get_mentors(subject: str = None, verified: bool = None, max_price: float = None):
    if not supabase:
        return []

    query = supabase.table("mentors").select("*")

    if subject:
        # Pedro: Implementa a busca parcial (case-insensitive)
        query = query.ilike("subject", f"%{subject}%")

    if verified is not None:
        # Pedro: Implementa o filtro de verificação
        query = query.eq("verified", verified)

    if max_price:
        # Pedro: Implementa o filtro de preço máximo
        query = query.lte("price", max_price)

    response = query.execute()
    return response.data

# Lucas deve adicionar a rota de perfil get_mentor_by_id aqui (Parte 2)
