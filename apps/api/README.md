# WhatsApp Kit API

NestJS backend API for WhatsApp Kit SaaS platform.

## Database Setup with Supabase

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions on setting up Supabase.

Quick steps:
1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Get your database connection string from Supabase dashboard
3. Create `.env` file in `apps/api/` directory:

```env
DATABASE_URL="postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates all tables)
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

### 4. Prisma Studio (Database GUI)

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` to view and edit your database.

## Database Schema

The Prisma schema includes the following models:

### Authentication & User Management
- **User**: User accounts with authentication
- **ApiKey**: API keys for integrations

### Contacts & Groups
- **Contact**: Individual contacts
- **ContactGroup**: Static or dynamic contact groups
- **ContactGroupMember**: Many-to-many relationship
- **ContactGroupFilter**: Dynamic group filters

### Templates
- **Template**: WhatsApp message templates

### Campaigns
- **Campaign**: Messaging campaigns
- **CampaignRecipient**: Campaign recipients with status tracking
- **CampaignStats**: Campaign statistics

### Conversations & Messages
- **Conversation**: Chat conversations (individual/group)
- **ConversationParticipant**: Group participants
- **Message**: Messages with status tracking

### Chatbot Flow
- **ChatbotFlow**: Visual flow builder data

### Notifications
- **Notification**: User notifications

## Running the API

```bash
# Development
nx serve api

# Production
nx build api
```

## API Endpoints

The API is available at `http://localhost:3000/api`

