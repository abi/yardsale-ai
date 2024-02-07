import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", port=7002, reload=True)
