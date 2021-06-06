const app = require('./index.js');
const Users = require('./entities/users.js');
const Events = require('./entities/events.js');
app.post('/registerNewUser', Users.createNewUser);
app.post('/events', Events.createNewEvent);