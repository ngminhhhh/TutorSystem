# Tutoring System

A simple tutoring/LMS prototype with a React frontend and an Express API server. The app supports login, tutor matching requests, profiles, workspaces, meetings, and basic mock data stored in JSON files.

## Tech Stack

- Frontend: React, React Router, Create React App
- Backend: Node.js, Express
- Data: Local JSON files

## Project Structure

- `lms-frontend/` - React app created with Create React App.
- `server/` - Express API server and local JSON data files.

## Requirements

- Node.js
- npm

## How to Run

Install dependencies for both apps:

```bash
cd server
npm install

cd ../lms-frontend
npm install
```

Start the backend API in one terminal:

```bash
cd server
npm start
```

The API runs at `http://localhost:4000`.

Start the frontend in another terminal:

```bash
cd lms-frontend
npm start
```

Open `http://localhost:3000` in your browser.

## Demo Accounts

- Student: `student` / `123456`
- Tutor: `teacher` / `123456`
- Admin: `admin` / `admin123`
