# Vue AI Chat Assistant

A modern AI chat application built with Vue 3, Tailwind CSS, and Shadcn UI components. The app integrates with OpenRouter and Azure AI to provide access to powerful AI models including Google Gemini and GPT-4.

## Features

- 🎨 Beautiful and responsive UI with Shadcn UI components
- 🌓 Dark/light mode support
- 🤖 Multiple AI providers (OpenRouter and Azure AI)
- 🔐 Authentication system
- 📱 Mobile-friendly design
- ✨ Smooth animations
- 🗄️ Local SQLite database using Prisma

## Setup

1. Install dependencies:

```sh
pnpm install
```

2. Create a `.env` file with your API keys:

```
# Database
DATABASE_URL="file:./dev.db"

# API Keys
VITE_OPENROUTER_API_KEY="your-openrouter-api-key"
VITE_OPENROUTER_SITE_URL="https://your-site.com"
VITE_OPENROUTER_SITE_NAME="Your Site Name"

# Azure AI
VITE_AZURE_ENDPOINT="https://models.inference.ai.azure.com"
VITE_AZURE_API_KEY="your-azure-api-key"
VITE_AZURE_MODEL="gpt-4o"

# Auth
VITE_AUTH_ENABLED="true"
```

3. Set up the database:

```sh
pnpm prisma migrate dev
```

4. Run the development server:

```sh
pnpm dev
```

## Authentication

The app includes a simple authentication system:

- Login with the demo account (username: `demo`, password: `password`)
- Set `VITE_AUTH_ENABLED="false"` in `.env` to disable authentication
- Authentication state is persisted in localStorage

In a production environment, you should implement a more robust authentication system (Auth0, Firebase, etc.).

## AI Models

The app supports two AI providers:

1. **OpenRouter** - Access to Gemini, GPT-4, Claude, and more models
2. **Azure AI** - Integration with Azure's AI models (requires Azure setup)

Users can switch between models during conversation.

## Static Website Support

For static website deployment (like GitHub Pages, Netlify, etc.):

- The Azure AI integration requires a backend service or serverless function
- The app will fallback to OpenRouter when deployed as a static site

## Technologies Used

- Vue 3 with Composition API
- Vue Router for routing
- Pinia for state management
- Tailwind CSS for styling
- Shadcn Vue for UI components
- Prisma for database management
- OpenAI SDK for AI model access
- Lucide icons for beautiful iconography

## Project Structure

- `src/components` - UI components
- `src/views` - Page components
- `src/services` - Database, AI, and Auth services
- `src/stores` - Pinia stores
- `src/lib` - Utility functions
- `prisma` - Database schema and migrations

## Development Commands

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
