import express from 'express';
import { Event, Invite, User } from './types';

const app = express();
app.use(express.json());

let events: Event[] = [];
let invites: Invite[] = [];
let users: User[] = [];

app.post('/events', (req, res) => {
  const event: Event = {
    id: Date.now().toString(),
    location: req.body.location || 'TBD',
    hostId: req.body.hostId || 'anonymous',
    invites: []
  };
  events.push(event);
  res.json(event);
});

app.get('/events', (req, res) => {
  res.json(events);
});

app.post('/invites', (req, res) => {
  const invite: Invite = {
    id: Date.now().toString(),
    eventId: req.body.eventId,
    userId: req.body.userId
  };
  invites.push(invite);
  
  const event = events.find(e => e.id === invite.eventId);
  if (event) {
    event.invites.push(invite.id);
  }
  
  res.json(invite);
});

app.get('/invites', (req, res) => {
  res.json(invites);
});

app.post('/users', (req, res) => {
  const user: User = {
    id: Date.now().toString(),
    name: req.body.name || 'User'
  };
  users.push(user);
  res.json(user);
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
