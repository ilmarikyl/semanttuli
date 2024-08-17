# Semanttuli

[![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Fly.io](https://img.shields.io/badge/Fly.io-8E75FF?style=for-the-badge&logo=flyio&logoColor=white)](https://fly.io/)

Semanttuli is the Finnish version of the [Semantle](https://semantle.com/) word guessing game.

🌐 **Live Application**: [https://semanttuli.fly.dev](https://semanttuli.fly.dev)

## 🚀 Getting Started

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
MONGO_CONNECTION_STRING=your_mongodb_connection_string
DB_NAME=your_database_name
```

### Local Development

#### Option 1: npm

1. Install dependencies:

   ```
   npm i
   ```

2. Run the development server:

   ```
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

#### Option 2: Docker

1. Build and run using Docker Compose:

   ```
   docker-compose up --build
   ```

   The app will be available at `http://localhost:8080`

## 🚢 Deployment

Currently, deployment is done manually using:

```
fly deploy
```

## 🧰 Technologies

- Framework: SvelteKit
- Language: TypeScript
- Styling: Tailwind CSS
- Database: MongoDB
- Containerization: Docker
- Hosting: Fly.io

## 🏛️ Legacy Version

The previous version of Semanttuli is still available:

- Repository: [https://github.com/ilmarikyl/semanttuli-legacy](https://github.com/ilmarikyl/semanttuli-legacy)
- Live application: [https://semanttuli-legacy.fly.dev](https://semanttuli-legacy.fly.dev)

## 📝 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
