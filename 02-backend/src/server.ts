import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import usersRouter from './routes/users';
import eventsRouter from './routes/events';
import invitesRouter from './routes/invites';
import { ApiResponse } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Event Management API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/users', usersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/invites', invitesRouter);

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Event Management API',
    version: '1.0.0',
    endpoints: {
      users: {
        'GET /api/users': 'Get all users',
        'GET /api/users/:id': 'Get user by ID',
        'POST /api/users': 'Create new user',
        'PUT /api/users/:id': 'Update user',
        'DELETE /api/users/:id': 'Delete user'
      },
      events: {
        'GET /api/events': 'Get all events',
        'GET /api/events/:id': 'Get event by ID',
        'GET /api/events/host/:hostId': 'Get events by host ID',
        'POST /api/events': 'Create new event',
        'PUT /api/events/:id': 'Update event',
        'DELETE /api/events/:id': 'Delete event'
      },
      invites: {
        'GET /api/invites': 'Get all invites',
        'GET /api/invites/:id': 'Get invite by ID',
        'GET /api/invites/event/:eventId': 'Get invites by event ID',
        'GET /api/invites/user/:userId': 'Get invites by user ID',
        'POST /api/invites': 'Create new invite',
        'PUT /api/invites/:id/status': 'Update invite status',
        'DELETE /api/invites/:id': 'Delete invite'
      }
    },
    sampleData: {
      createUser: {
        email: 'user@example.com',
        name: 'John Doe'
      },
      createEvent: {
        title: 'Team Meeting',
        description: 'Weekly team sync',
        location: 'Conference Room A',
        hostId: 'user-id-here',
        startDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        maxAttendees: 10,
        isPublic: false
      },
      createInvite: {
        eventId: 'event-id-here',
        userId: 'user-id-here'
      },
      updateInviteStatus: {
        status: 'accepted'
      }
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res: express.Response<ApiResponse<null>>) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Event Management API server is running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(`\n🔗 Available endpoints:`);
  console.log(`   Users: http://localhost:${PORT}/api/users`);
  console.log(`   Events: http://localhost:${PORT}/api/events`);
  console.log(`   Invites: http://localhost:${PORT}/api/invites`);
});

export default app;
