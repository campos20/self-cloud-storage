# cloudstorage server

## Requirements

* [Python 3.10](https://www.python.org/)
* [pip](https://pip.pypa.io/en/stable/installation/)

## Get started

- Clone this project

- Navigate to the server folder

        cd server

- Install dependencies in a virtual environment

        python3 -m virtualenv venv
        source venv/bin/activate
        pip3 install -r requirements.txt

- Start the server

        uvicorn src.main:app --reload

- Visit

        http://localhost:8000/docs

## Debugging

### VS Code

- Create a file named `.vscode/launch.json` with the following content

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Module",
            "type": "python",
            "request": "launch",
            "module": "uvicorn",
            "cwd": "server",
            "args": [
                "src.main:app",
                "--reload"
            ]
        }
    ]
}
```

- Start debugging with `F5`.

### Another IDEs

- You are on your own. Please add whatever works for you in this section.