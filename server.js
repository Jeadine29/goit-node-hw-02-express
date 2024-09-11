const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/api/users');
const contactsRouter = require('./routes/api/contacts');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/yourdbname', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/users', usersRouter);
app.use('/contacts', contactsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
