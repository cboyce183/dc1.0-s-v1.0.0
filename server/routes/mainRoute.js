const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/', (req, res) => res.status(200).json({message: 'awesome'}));

router.post('/login', async (req, res) => {
  if (!req.body) return res.status(400).json({ message: 'A body element is necessary in the request object' });
  if (!req.body.name) return res.status(400).json({ message: 'The user\'s name cannot be empty' });
  if (!req.body.email) return res.status(400).json({ message: 'The user\'s email cannot be empty' });
  if (!req.body.picture) return res.status(400).json({ message: 'The user\'s picture object cannot be empty' });
  if (!req.body.picture.data) return res.status(400).json({ message: 'The user\'s picture data object cannot be empty' });

  const name = req.body.name;
  const email = req.body.email;
  const pictureUrl = req.body.picture.data.url;

  const newUser = User({ name, email, pictureUrl });
  console.log('about to save ->', newUser);
  const dbUser = await User.findOne({ email: email }).catch(err => console.error(err));
  if (dbUser) return res.status(200).json({message: 'login ok', user: dbUser});
  const savedUser = await newUser.save().catch(err => console.error(err));
  if (savedUser) return res.status(200).json({message: 'signup ok', user: savedUser});
  return res.status(500).json({ message: 'server side error', error: err})
});

module.exports = router;