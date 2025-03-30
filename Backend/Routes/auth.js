const express = require('express');
const router = express.Router();
const User = require('/models/User'); //File location daal isme /models ke pehele
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send('User created');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('Cannot find user');
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign({ userId: user._id }, jwtConfig.secret, jwtConfig.options);
      res.json({ accessToken: accessToken });
    } else {
      res.send('Not Allowed');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;