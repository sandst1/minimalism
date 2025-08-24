export interface User {
  id: string;
  name: string;
}

export interface Invite {
  id: string;
  eventId: string;
  userId: string;
}

export interface Event {
  id: string;
  location: string;
  hostId: string;
  invites: string[];
}
