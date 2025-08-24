# Event Management Backend

A Node.js + Express + TypeScript backend for managing events, users, and invites.

## Features

- **User Management**: Create, read, update, and delete users
- **Event Management**: Create and manage events with location, host, and attendee limits
- **Invite System**: Send invites to users and track their responses
- **TypeScript**: Full TypeScript support for type safety
- **In-Memory Database**: Simple in-memory storage with sample data
- **REST API**: Clean RESTful API design
- **Error Handling**: Comprehensive error handling with meaningful responses

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Or start the production server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/host/:hostId` - Get events by host ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Invites
- `GET /api/invites` - Get all invites
- `GET /api/invites/:id` - Get invite by ID
- `GET /api/invites/event/:eventId` - Get invites by event ID
- `GET /api/invites/user/:userId` - Get invites by user ID
- `POST /api/invites` - Create new invite
- `PUT /api/invites/:id/status` - Update invite status
- `DELETE /api/invites/:id` - Delete invite

## Sample Data

The application comes with pre-seeded sample data including:
- 3 sample users
- 2 sample events
- 3 sample invites

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Event
```typescript
{
  id: string;
  title: string;
  description: string;
  location: string;
  hostId: string;
  startDateTime: Date;
  endDateTime: Date;
  maxAttendees?: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Invite
```typescript
{
  id: string;
  eventId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  invitedAt: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Example Usage

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "name": "John Doe"}'
```

### Create an Event
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team Meeting",
    "description": "Weekly team sync",
    "location": "Conference Room A",
    "hostId": "host-user-id",
    "startDateTime": "2024-01-15T10:00:00Z",
    "endDateTime": "2024-01-15T11:00:00Z",
    "maxAttendees": 10,
    "isPublic": false
  }'
```

### Send an Invite
```bash
curl -X POST http://localhost:3000/api/invites \
  -H "Content-Type: application/json" \
  -d '{"eventId": "event-id", "userId": "user-id"}'
```

### Accept an Invite
```bash
curl -X PUT http://localhost:3000/api/invites/invite-id/status \
  -H "Content-Type: application/json" \
  -d '{"status": "accepted"}'
```

Visit `http://localhost:3000` for complete API documentation and examples.
