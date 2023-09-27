from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
import json

app = FastAPI()

# Configurazione del middleware CORS
app.add_middleware(
    CORSMiddleware,
    # Specifica il dominio consentito per l'accesso
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET", "POST", "OPTIONS"],  # Specifica i metodi consentiti
    allow_headers=["*"],  # Specifica gli header consentiti
)


@app.get("/{full_path:path}")
async def get_json(request: Request, full_path: str):
    request_name = full_path
    if "?" in request_name:
        index = request_name.index("?")
        request_name = request_name[:index]
    print(request_name)
    json_path = os.path.join("answers", request_name + ".json")
    if os.path.exists(json_path):
        with open(json_path, "r") as json_file:
            content = json.load(json_file)
            return content
    else:
        return {"error": "JSON not found"}


@app.post("/{full_path:path}")
async def get_json(request: Request, full_path: str):
    request_name = full_path
    if "?" in request_name:
        index = request_name.index("?")
        request_name = request_name[:index]
    print(request_name)
    json_path = os.path.join("answers", request_name + ".json")
    if os.path.exists(json_path):
        with open(json_path, "r") as json_file:
            content = json.load(json_file)
            return content
    else:
        return {"error": "JSON not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=80)
