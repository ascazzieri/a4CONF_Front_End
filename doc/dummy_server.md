# Dummy JSON Server

This Python server, built using the FastAPI framework, simulates the behavior of the a4GATE API locally. It serves predefined JSON responses based on the request paths.

## Features

- **CORS Middleware**: Configured to allow requests from specified origins.
- **GET and POST Endpoints**: Serve JSON responses for both GET and POST requests.
- **Dynamic Response Loading**: Loads responses from JSON files based on the request path.

## Setup and Configuration

### Prerequisites

- Python 3.7+
- FastAPI
- Uvicorn
- Node.js (for running the app script)

### Installing Dependencies

1. Create a virtual environment:
   ```sh
   python -m venv venv
2. Activate the virtual environment:

    - On Windows:
        ```sh
        venv\Scripts\activate
        ```
        On macOS/Linux:
        ```sh
        source venv/bin/activate
        ```
3. Install the required packages:

        ```sh
        pip install fastapi uvicorn
        ```
## Setup

### Running the server
To start the server, run the following command:
```sh
uvicorn main:app --host 0.0.0.0 --port 80
```
Or use the app script to start both the server and the React dev server
```sh
npm start
```

### Setting up JSON response

1. Create a directory structure under dummy_server/answers/ to match your API routes.
2. Place the JSON response files in the appropriate directories.
For example, to set up a response for the **/a4gate/bidir** route, create the file **dummy_server/answers/a4gate/bidir.json**.

```code
dummy_server/
└── answers/
    └── a4gate/
        └── bidir.json
```

### API endpoints

#### GET /{full_path:path}

Fetches the JSON response based on the requested path.

**Example request:**
```sh
curl http://localhost:80/a4gate/bidir
```
**Example Response:**
```sh
{
  "key": "value"
}
```

#### POST /{full_path:path}
Fetches the JSON response based on the requested path.

**Example Request:**
```sh
curl -X POST http://localhost:80/a4gate/bidir
```

**Example Response:**
```sh
{
  "key": "value"
}
```

#### Code Overview

**CORS Middleware:**

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
```

#### GET and POST Endpoints

```python
@app.get("/{full_path:path}")
async def get_json(request: Request, full_path: str):
    request_name = full_path
    if "?" in request_name:
        index = request_name.index("?")
        request_name = request_name[:index]
    print(request_name)
    json_path = os.path.join("dummy_server", "answers", request_name + ".json")
    if os.path.exists(json_path):
        with open(json_path, "r") as json_file:
            content = json.load(json_file)
            print(content)
            return content
    else:
        return None

```

```python
@app.post("/{full_path:path}")
async def get_json(request: Request, full_path: str):
    request_name = full_path
    if "?" in request_name:
        index = request_name.index("?")
        request_name = request_name[:index]
    print(request_name)
    json_path = os.path.join("dummy_server", "answers", request_name + ".json")
    if os.path.exists(json_path):
        with open(json_path, "r") as json_file:
            content = json.load(json_file)
            print(content)
            return content
    else:
        return None

```

By following the above setup and configuration instructions, you can simulate the behavior of the a4GATE API locally on your development machine. This setup helps in developing and testing the application without the need for a live API.

Feel free to extend this server by adding more JSON files in the `dummy_server/answers/` directory to cover all required API routes and responses.

## Additional Notes

- **Error Handling**: The current implementation does not provide detailed error responses for missing JSON files. You may want to enhance the server to return more informative error messages.
- **Security**: This dummy server is intended for local development and testing only. Do not use it in production environments.

