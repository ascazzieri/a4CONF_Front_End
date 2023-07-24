from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import json

app = FastAPI()

# Configurazione del middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specifica il dominio consentito per l'accesso
    allow_methods=["GET", "POST", "OPTIONS"],  # Specifica i metodi consentiti
    allow_headers=["*"],  # Specifica gli header consentiti
)


@app.get("/{request_name}")
async def get_json(request_name: str):
    if "?" in request_name:
        index = request_name.index("?")
        request_name = request_name[:index]
    json_path = f"answers/{request_name}.json"
    if os.path.exists(json_path):
        with open(json_path, "r") as json_file:
            content = json.load(json_file)
            return content
    else:
        return {"error": "JSON not found"}
    
@app.post("/{request_name}")
async def post_json(request_name: str, content: dict):
    json_path = f"answers/{request_name}.json"
    with open(json_path, "w") as json_file:
        json.dump(content, json_file)
    return {"message": "JSON saved successfully"}