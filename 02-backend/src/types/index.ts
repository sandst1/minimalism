export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  hostId: string; // References User.id
  startDateTime: Date;
  endDateTime: Date;
  maxAttendees?: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invite {
  id: string;
  eventId: string; // References Event.id
  userId: string; // References User.id
  status: InviteStatus;
  invitedAt: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum InviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  CANCELLED = 'cancelled'
}

// Request/Response DTOs
export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  location: string;
  hostId: string;
  startDateTime: string; // ISO string
  endDateTime: string; // ISO string
  maxAttendees?: number;
  isPublic?: boolean;
}

export interface CreateInviteRequest {
  eventId: string;
  userId: string;
}

export interface UpdateInviteStatusRequest {
  status: InviteStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Extended types with relations
export interface EventWithHost extends Event {
  host: User;
  invites: Invite[];
}

export interface InviteWithDetails extends Invite {
  event: Event;
  user: User;
}
