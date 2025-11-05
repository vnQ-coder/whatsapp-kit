# Nx Monorepo - WhatsApp Kit App

This is an Nx monorepo containing a NestJS backend API and a Next.js frontend client for a WhatsApp kit application.

## Project Structure

```
nx-monorepo/
├── apps/
│   ├── api/          # NestJS backend application
│   ├── client/       # Next.js frontend application
│   └── client-e2e/   # E2E tests for Next.js app
├── libs/             # Shared libraries (to be created)
└── tools/            # Build tools and utilities
```

## Applications

### NestJS API (`apps/api`)
- **Framework**: NestJS
- **Default Port**: 3000
- **Global Prefix**: `/api`
- **Build**: `nx build api`
- **Serve**: `nx serve api`
- **Test**: `nx test api`

### Next.js Client (`apps/client`)
- **Framework**: Next.js 15
- **Default Port**: 4200 (configured by Nx)
- **Build**: `nx build client`
- **Dev**: `nx dev client`
- **Start**: `nx start client`
- **Test**: `nx test client`
- **E2E**: `nx e2e client-e2e`

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
npm install
```

### Running Applications

**Run NestJS API:**
```bash
nx serve api
```
The API will be available at `http://localhost:3000/api`

**Run Next.js Client:**
```bash
nx dev client
```
The client will be available at `http://localhost:4200`

**Run both applications concurrently:**
```bash
nx run-many --target=serve --projects=api --parallel=2
```

## Development Commands

- `nx graph` - Visualize the project dependency graph
- `nx show project <project-name>` - Show project details
- `nx test <project-name>` - Run tests for a project
- `nx lint <project-name>` - Run linting for a project
- `nx build <project-name>` - Build a project

## Next Steps

1. **Install WhatsApp SDK**: Add the WhatsApp SDK package to your API or create a shared library
   ```bash
   npm install whatsapp-web.js
   # or
   npm install @whatsapp-business/api
   ```

2. **Create Shared Libraries**: Use Nx generators to create shared libraries
   ```bash
   nx generate @nx/node:library --name=whatsapp-sdk --directory=libs/whatsapp-sdk
   ```

3. **Configure Environment Variables**: Create `.env` files for API keys and configuration

4. **Set up CORS**: Configure CORS in NestJS to allow requests from the Next.js client

## Resources

- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Nx NestJS Plugin](https://nx.dev/docs/technologies/node/nest)
- [Nx Next.js Plugin](https://nx.dev/docs/technologies/react/next)

