# Projeto Integrador - Plataforma de Mentoria (Tutori)

Este projeto é a Prova de Conceito (PoC) da plataforma Tutori, desenvolvida para o Projeto Integrador do Quarto Semestre de TADS/TSI. A PoC implementa a jornada principal de **Busca e Agendamento de um Mentor**.

## 👥 Integrantes da Equipe

| **Nome do Aluno** | **Contribuição Principal (PoC)** |
| :--- | :--- |
| Pedro | Backend (API - Rota de Busca e Filtros) |
| Lucas | Backend (API - Rota de Perfil e Modelagem Pydantic) |
| Thaina | Frontend (Frontend - Estrutura HTML) |
| Leandra | Frontend (Frontend - Estilização CSS) |
| Daniel | Persistência (SQL, Supabase) |
| Guilherme | Gestão de Repositório, JavaScript,Documentação (README) e Criação do Vídeo |

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 (com TailwindCSS), JavaScript (Puro)

* **Backend (API):** Python, FastAPI

* **Banco de Dados:** Supabase (PostgreSQL)

* **Deployment:** Vercel (para API e Frontend estático)

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

1. Python 3.10+
2. Gerenciador de pacotes `pip`
3. Acesso ao painel do Supabase com as credenciais de URL e Key.
4. Criação do .env para chaves: SUPABASE_URL e SUPABASE_KEY

### 1. Configuração do Backend (API)

A API utiliza o FastAPI para se conectar ao Supabase.

1. **Instale as dependências:**

Dentro da pasta backend

   ```bash
   pip install -r requirements.txt
```
   2. **Rodar localmente:**

Na pasta principal
  ```bash
     uvicorn backend.index:app --reload

