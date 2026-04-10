# W-CEV: Web Component Editor/Visualizer

W-CEV is an open-source, local-first SaaS application that lets you instantly generate, edit, and visualize production-ready web components using AI.

## Features

- ✨ **AI Component Generation**: Describe the UI you want, and the LLM instantly generates a complete, styled HTML component.
- 💻 **Integrated Code Editor**: Fine-tune generated code using an embedded Monaco Editor.
- 📱 **Responsive Live Preview**: Tweak HTML/CSS/JS and watch it update instantly inside a sandboxed iframe with mobile, tablet, and desktop viewports.
- 📂 **Component Gallery**: Automatically save and manage your library of components in a SQLite database.
- 🌙 **Premium Aesthetic**: Beautiful dark mode, glassmorphism, and smooth animations out of the box.

## Architecture

- **Frontend**: React 19, Vite, Lucide Icons, Monaco Editor.
- **Backend**: FastAPI, Python 3.11, SQLite (aiosqlite).
- **Orchestration**: Docker Compose.

## Quick Start (Docker)

To run the full stack locally:

1. Clone the repository
2. Provide your OpenAI Key in `Backend/.env`:
   ```env
   OPENAI_API_KEY=your_key_here
   ```
3. Start the services:
   ```bash
   make start-dev
   # or
   docker compose up --build
   ```
4. Access the web interface at: `http://localhost:5173`
   Access the backend API at: `http://localhost:8000/docs`

## Screenshots

*(Screenshots can be added here)*

## Roadmap & Enhancements

- [x] v1.0 AI Generation + Monaco Editor + Dashboard
- [ ] OAuth Authentication (Google/GitHub)
- [ ] Multi-file support (separate HTML/CSS/JS tabs)
- [ ] Integration with alternative LLMs (Anthropic, Google)
