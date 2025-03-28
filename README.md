# Vue AI Chat Assistant

A modern AI chat application built with Vue 3, Tailwind CSS, and Shadcn UI components. The app integrates with OpenRouter to provide access to powerful AI models including Google Gemini and GPT-4.

## Features

- 🎨 Beautiful and responsive UI with Shadcn UI components
- 🌓 Dark/light mode support
- 🤖 Integration with multiple AI models through OpenRouter
- 📱 Mobile-friendly design
- ✨ Smooth animations using @vueuse/motion
- 🗄️ Local SQLite database using Prisma

## Setup

1. Install dependencies:

```sh
pnpm install
```

2. Create a `.env` file with your OpenRouter API key:

```
DATABASE_URL="file:./dev.db"
OPENROUTER_API_KEY="your-openrouter-api-key"
```

3. Update the `OPENROUTER_API_KEY` in `src/services/ai.ts` with your API key.

4. Set up the database:

```sh
pnpm prisma migrate dev
```

5. Run the development server:

```sh
pnpm dev
```

## Technologies Used

- Vue 3 with Composition API
- Vue Router for routing
- Pinia for state management
- Tailwind CSS for styling
- Shadcn Vue for UI components
- Prisma for database management
- OpenRouter SDK for AI model access
- Lucide icons for beautiful iconography

## Project Structure

- `src/components` - UI components
- `src/views` - Page components
- `src/services` - Database and AI service layer
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
