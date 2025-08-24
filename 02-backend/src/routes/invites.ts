import { Router, Request, Response } from 'express';
import { database } from '../services/database';
import { CreateInviteRequest, UpdateInviteStatusRequest, ApiResponse, Invite, InviteWithDetails, InviteStatus } from '../types';
import { AppError, asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/invites - Get all invites
router.get('/', asyncHandler(async (req: Request, res: Response<ApiResponse<InviteWithDetails[]>>) => {
  const invites = database.getAllInvites();
  const invitesWithDetails: InviteWithDetails[] = invites.map(invite => {
    const event = database.getEventById(invite.eventId);
    const user = database.getUserById(invite.userId);
    return {
      ...invite,
      event: event!,
      user: user!
    };
  });

  res.json({
    success: true,
    data: invitesWithDetails,
    message: `Retrieved ${invites.length} invites`
  });
}));

// GET /api/invites/:id - Get invite by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response<ApiResponse<InviteWithDetails>>) => {
  const { id } = req.params;
  const invite = database.getInviteById(id);
  
  if (!invite) {
    throw new AppError('Invite not found', 404);
  }

  const event = database.getEventById(invite.eventId);
  const user = database.getUserById(invite.userId);

  const inviteWithDetails: InviteWithDetails = {
    ...invite,
    event: event!,
    user: user!
  };

  res.json({
    success: true,
    data: inviteWithDetails
  });
}));

// GET /api/invites/event/:eventId - Get invites by event ID
router.get('/event/:eventId', asyncHandler(async (req: Request, res: Response<ApiResponse<InviteWithDetails[]>>) => {
  const { eventId } = req.params;
  
  // Verify event exists
  const event = database.getEventById(eventId);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const invites = database.getInvitesByEventId(eventId);
  const invitesWithDetails: InviteWithDetails[] = invites.map(invite => {
    const user = database.getUserById(invite.userId);
    return {
      ...invite,
      event,
      user: user!
    };
  });

  res.json({
    success: true,
    data: invitesWithDetails,
    message: `Retrieved ${invites.length} invites for event "${event.title}"`
  });
}));

// GET /api/invites/user/:userId - Get invites by user ID
router.get('/user/:userId', asyncHandler(async (req: Request, res: Response<ApiResponse<InviteWithDetails[]>>) => {
  const { userId } = req.params;
  
  // Verify user exists
  const user = database.getUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const invites = database.getInvitesByUserId(userId);
  const invitesWithDetails: InviteWithDetails[] = invites.map(invite => {
    const event = database.getEventById(invite.eventId);
    return {
      ...invite,
      event: event!,
      user
    };
  });

  res.json({
    success: true,
    data: invitesWithDetails,
    message: `Retrieved ${invites.length} invites for user "${user.name}"`
  });
}));

// POST /api/invites - Create new invite
router.post('/', asyncHandler(async (req: Request<{}, ApiResponse<Invite>, CreateInviteRequest>, res: Response<ApiResponse<Invite>>) => {
  const { eventId, userId } = req.body;

  if (!eventId || !userId) {
    throw new AppError('EventId and userId are required', 400);
  }

  // Verify event exists
  const event = database.getEventById(eventId);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Verify user exists
  const user = database.getUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if invite already exists
  const existingInvite = database.getInviteByEventAndUser(eventId, userId);
  if (existingInvite) {
    throw new AppError('Invite already exists for this user and event', 409);
  }

  // Check if event has reached max attendees (only count accepted invites)
  if (event.maxAttendees) {
    const acceptedInvites = database.getInvitesByEventId(eventId)
      .filter(invite => invite.status === InviteStatus.ACCEPTED);
    
    if (acceptedInvites.length >= event.maxAttendees) {
      throw new AppError('Event has reached maximum capacity', 400);
    }
  }

  const invite = database.createInvite({
    eventId,
    userId,
    status: InviteStatus.PENDING,
    invitedAt: new Date()
  });

  res.status(201).json({
    success: true,
    data: invite,
    message: 'Invite created successfully'
  });
}));

// PUT /api/invites/:id/status - Update invite status
router.put('/:id/status', asyncHandler(async (req: Request<{id: string}, ApiResponse<Invite>, UpdateInviteStatusRequest>, res: Response<ApiResponse<Invite>>) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !Object.values(InviteStatus).includes(status)) {
    throw new AppError('Valid status is required', 400);
  }

  // Check if invite exists
  const existingInvite = database.getInviteById(id);
  if (!existingInvite) {
    throw new AppError('Invite not found', 404);
  }

  // If accepting, check event capacity
  if (status === InviteStatus.ACCEPTED && existingInvite.status !== InviteStatus.ACCEPTED) {
    const event = database.getEventById(existingInvite.eventId);
    if (event?.maxAttendees) {
      const acceptedInvites = database.getInvitesByEventId(existingInvite.eventId)
        .filter(invite => invite.status === InviteStatus.ACCEPTED);
      
      if (acceptedInvites.length >= event.maxAttendees) {
        throw new AppError('Event has reached maximum capacity', 400);
      }
    }
  }

  const updateData: any = { status };
  
  // Set respondedAt timestamp if status is being changed from pending
  if (existingInvite.status === InviteStatus.PENDING && 
      (status === InviteStatus.ACCEPTED || status === InviteStatus.DECLINED)) {
    updateData.respondedAt = new Date();
  }

  const updatedInvite = database.updateInvite(id, updateData);

  res.json({
    success: true,
    data: updatedInvite,
    message: `Invite status updated to ${status}`
  });
}));

// DELETE /api/invites/:id - Delete invite
router.delete('/:id', asyncHandler(async (req: Request, res: Response<ApiResponse<null>>) => {
  const { id } = req.params;

  const invite = database.getInviteById(id);
  if (!invite) {
    throw new AppError('Invite not found', 404);
  }

  const deleted = database.deleteInvite(id);
  
  if (!deleted) {
    throw new AppError('Failed to delete invite', 500);
  }

  res.json({
    success: true,
    message: 'Invite deleted successfully'
  });
}));

export default router;
