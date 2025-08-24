import { Router, Request, Response } from 'express';
import { database } from '../services/database';
import { CreateEventRequest, ApiResponse, Event, EventWithHost } from '../types';
import { AppError, asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/events - Get all events
router.get('/', asyncHandler(async (req: Request, res: Response<ApiResponse<EventWithHost[]>>) => {
  const events = database.getAllEvents();
  const eventsWithHost: EventWithHost[] = events.map(event => {
    const host = database.getUserById(event.hostId);
    const invites = database.getInvitesByEventId(event.id);
    return {
      ...event,
      host: host!,
      invites
    };
  });

  res.json({
    success: true,
    data: eventsWithHost,
    message: `Retrieved ${events.length} events`
  });
}));

// GET /api/events/:id - Get event by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response<ApiResponse<EventWithHost>>) => {
  const { id } = req.params;
  const event = database.getEventById(id);
  
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const host = database.getUserById(event.hostId);
  const invites = database.getInvitesByEventId(event.id);

  const eventWithHost: EventWithHost = {
    ...event,
    host: host!,
    invites
  };

  res.json({
    success: true,
    data: eventWithHost
  });
}));

// GET /api/events/host/:hostId - Get events by host ID
router.get('/host/:hostId', asyncHandler(async (req: Request, res: Response<ApiResponse<EventWithHost[]>>) => {
  const { hostId } = req.params;
  
  // Verify host exists
  const host = database.getUserById(hostId);
  if (!host) {
    throw new AppError('Host not found', 404);
  }

  const events = database.getEventsByHostId(hostId);
  const eventsWithHost: EventWithHost[] = events.map(event => {
    const invites = database.getInvitesByEventId(event.id);
    return {
      ...event,
      host,
      invites
    };
  });

  res.json({
    success: true,
    data: eventsWithHost,
    message: `Retrieved ${events.length} events for host ${host.name}`
  });
}));

// POST /api/events - Create new event
router.post('/', asyncHandler(async (req: Request<{}, ApiResponse<Event>, CreateEventRequest>, res: Response<ApiResponse<Event>>) => {
  const { title, description, location, hostId, startDateTime, endDateTime, maxAttendees, isPublic } = req.body;

  if (!title || !location || !hostId || !startDateTime || !endDateTime) {
    throw new AppError('Title, location, hostId, startDateTime, and endDateTime are required', 400);
  }

  // Verify host exists
  const host = database.getUserById(hostId);
  if (!host) {
    throw new AppError('Host not found', 404);
  }

  // Parse and validate dates
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new AppError('Invalid date format', 400);
  }

  if (startDate >= endDate) {
    throw new AppError('Start date must be before end date', 400);
  }

  if (startDate < new Date()) {
    throw new AppError('Start date cannot be in the past', 400);
  }

  const event = database.createEvent({
    title,
    description: description || '',
    location,
    hostId,
    startDateTime: startDate,
    endDateTime: endDate,
    maxAttendees,
    isPublic: isPublic ?? true
  });

  res.status(201).json({
    success: true,
    data: event,
    message: 'Event created successfully'
  });
}));

// PUT /api/events/:id - Update event
router.put('/:id', asyncHandler(async (req: Request, res: Response<ApiResponse<Event>>) => {
  const { id } = req.params;
  const { title, description, location, startDateTime, endDateTime, maxAttendees, isPublic } = req.body;

  // Check if event exists
  const existingEvent = database.getEventById(id);
  if (!existingEvent) {
    throw new AppError('Event not found', 404);
  }

  // Parse dates if provided
  let startDate, endDate;
  if (startDateTime) {
    startDate = new Date(startDateTime);
    if (isNaN(startDate.getTime())) {
      throw new AppError('Invalid start date format', 400);
    }
  }

  if (endDateTime) {
    endDate = new Date(endDateTime);
    if (isNaN(endDate.getTime())) {
      throw new AppError('Invalid end date format', 400);
    }
  }

  // Validate date logic
  const finalStartDate = startDate || existingEvent.startDateTime;
  const finalEndDate = endDate || existingEvent.endDateTime;

  if (finalStartDate >= finalEndDate) {
    throw new AppError('Start date must be before end date', 400);
  }

  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (location !== undefined) updateData.location = location;
  if (startDate) updateData.startDateTime = startDate;
  if (endDate) updateData.endDateTime = endDate;
  if (maxAttendees !== undefined) updateData.maxAttendees = maxAttendees;
  if (isPublic !== undefined) updateData.isPublic = isPublic;

  const updatedEvent = database.updateEvent(id, updateData);

  res.json({
    success: true,
    data: updatedEvent,
    message: 'Event updated successfully'
  });
}));

// DELETE /api/events/:id - Delete event
router.delete('/:id', asyncHandler(async (req: Request, res: Response<ApiResponse<null>>) => {
  const { id } = req.params;

  const event = database.getEventById(id);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const deleted = database.deleteEvent(id);
  
  if (!deleted) {
    throw new AppError('Failed to delete event', 500);
  }

  res.json({
    success: true,
    message: 'Event and associated invites deleted successfully'
  });
}));

export default router;
