import { v4 as uuidv4 } from 'uuid';
import { User, Event, Invite, InviteStatus } from '../types';

class Database {
  private users: Map<string, User> = new Map();
  private events: Map<string, Event> = new Map();
  private invites: Map<string, Invite> = new Map();

  constructor() {
    this.seedData();
  }

  // User operations
  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const user: User = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // Event operations
  createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Event {
    const event: Event = {
      id: uuidv4(),
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.events.set(event.id, event);
    return event;
  }

  getEventById(id: string): Event | undefined {
    return this.events.get(id);
  }

  getAllEvents(): Event[] {
    return Array.from(this.events.values());
  }

  getEventsByHostId(hostId: string): Event[] {
    return Array.from(this.events.values()).filter(event => event.hostId === hostId);
  }

  updateEvent(id: string, updates: Partial<Omit<Event, 'id' | 'createdAt'>>): Event | undefined {
    const event = this.events.get(id);
    if (!event) return undefined;

    const updatedEvent = {
      ...event,
      ...updates,
      updatedAt: new Date()
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  deleteEvent(id: string): boolean {
    // Also delete related invites
    const eventInvites = this.getInvitesByEventId(id);
    eventInvites.forEach(invite => this.invites.delete(invite.id));
    
    return this.events.delete(id);
  }

  // Invite operations
  createInvite(inviteData: Omit<Invite, 'id' | 'createdAt' | 'updatedAt'>): Invite {
    const invite: Invite = {
      id: uuidv4(),
      ...inviteData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.invites.set(invite.id, invite);
    return invite;
  }

  getInviteById(id: string): Invite | undefined {
    return this.invites.get(id);
  }

  getAllInvites(): Invite[] {
    return Array.from(this.invites.values());
  }

  getInvitesByEventId(eventId: string): Invite[] {
    return Array.from(this.invites.values()).filter(invite => invite.eventId === eventId);
  }

  getInvitesByUserId(userId: string): Invite[] {
    return Array.from(this.invites.values()).filter(invite => invite.userId === userId);
  }

  getInviteByEventAndUser(eventId: string, userId: string): Invite | undefined {
    return Array.from(this.invites.values()).find(
      invite => invite.eventId === eventId && invite.userId === userId
    );
  }

  updateInvite(id: string, updates: Partial<Omit<Invite, 'id' | 'createdAt'>>): Invite | undefined {
    const invite = this.invites.get(id);
    if (!invite) return undefined;

    const updatedInvite = {
      ...invite,
      ...updates,
      updatedAt: new Date()
    };
    this.invites.set(id, updatedInvite);
    return updatedInvite;
  }

  deleteInvite(id: string): boolean {
    return this.invites.delete(id);
  }

  // Seed some initial data
  private seedData(): void {
    // Create sample users
    const user1 = this.createUser({
      email: 'john.doe@example.com',
      name: 'John Doe'
    });

    const user2 = this.createUser({
      email: 'jane.smith@example.com',
      name: 'Jane Smith'
    });

    const user3 = this.createUser({
      email: 'bob.wilson@example.com',
      name: 'Bob Wilson'
    });

    // Create sample events
    const event1 = this.createEvent({
      title: 'Team Building Workshop',
      description: 'Annual team building activities and lunch',
      location: 'Conference Room A, 123 Main St',
      hostId: user1.id,
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      endDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
      maxAttendees: 20,
      isPublic: false
    });

    const event2 = this.createEvent({
      title: 'Coffee Meetup',
      description: 'Casual coffee and networking',
      location: 'Starbucks Downtown',
      hostId: user2.id,
      startDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      endDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
      isPublic: true
    });

    // Create sample invites
    this.createInvite({
      eventId: event1.id,
      userId: user2.id,
      status: InviteStatus.PENDING,
      invitedAt: new Date()
    });

    this.createInvite({
      eventId: event1.id,
      userId: user3.id,
      status: InviteStatus.ACCEPTED,
      invitedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      respondedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    });

    this.createInvite({
      eventId: event2.id,
      userId: user1.id,
      status: InviteStatus.PENDING,
      invitedAt: new Date()
    });
  }
}

export const database = new Database();
