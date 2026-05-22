How to run:

Open 2 terminals (easiest)

First terminal window (backend API):
1. Navigate to the /Python/api folder
2. Create virtual enviorment: python -m venv .venv
3. Active enviorment: Windows users use: .venv/Scripts/activate or Mac/Linux users source .venv/bin/activate
4. Install dependencies: pip install -r requirements.txt
5. To run: python api.python

Second terminal window (front end):
1. Create a .env file
2. Install npm packages: npm install
3. To run: npm run dev
4. ctrl+click on local host link to open in a browser window.

# Frontend
VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
VITE_API_URL=http://127.0.0.1:5000