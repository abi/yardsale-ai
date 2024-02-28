# Yardsale AI

Create a nice Facebook Marketplace listing for anything you own and want to sell. A simple app that uses GPT-4 Vision and Whisper to generate the listing.

## 🚀 Try It Out!

[Try it here](https://yardsaleai.com) (while my budget allows, it's free to try). Or see [Getting Started](#-getting-started) below for local install instructions.

## 🛠 Getting Started

The app has a React/Vite frontend and a FastAPI backend. You will need an OpenAI API key with access to the GPT-4 Vision API.

Run the backend (I use Poetry for package management - `pip install poetry` if you don't have it):

```bash
cd backend
echo "OPENAI_API_KEY=sk-your-key" > .env
poetry install
poetry shell
poetry run uvicorn main:app --reload --port 7002
```

Run the frontend:

```bash
cd frontend
yarn
yarn dev
```

Open http://localhost:5173 to use the app.

If you prefer to run the backend on a different port, update VITE_WS_BACKEND_URL and VITE_HTTP_BACKEND_URL in `frontend/.env.local`


## 🙋‍♂️ FAQs

- **How can I provide feedback?** For feedback, feature requests and bug reports, open an issue or ping me on [Twitter](https://twitter.com/_abi_).

## 📚 Examples

...
