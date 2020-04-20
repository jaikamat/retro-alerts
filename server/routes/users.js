var express = require('express');
var router = express.Router();
const User = require('../database/models/user');


/* GET users listing. */
router.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// GET specific user
router.get('/:id', async (req, res, next) => {
  try {
    // Get user here
    res.json('get single user')
  } catch (err) {
    next(err);
  }
})

// GET specific user wantlist
router.get('/:id/wantlist', async (req, res, next) => {
  try {
    // Get user wantlist here
    res.json('get wantlist')
  } catch (err) {
    next(err);
  }
})

// POST specific user wantlist
router.post('/:id/wantlist', async (req, res, next) => {
  try {
    // Post user wantlist here
    res.json('post wantlist')
  } catch (err) {
    next(err);
  }
})

/* POST users listing. */
router.post('/', async (req, res, next) => {
  try {
    const sampleUser = new User({
      username: 'Jai',
      email: 'lance@lance.lance',
      phone: 1234567890,
      wantlist: [{
        title: 'Hobo Heores',
        SKU: '9wq8e7q9w8e7'
      }]
    });

    await sampleUser.save();

    res.send('user was supposed to be saved');
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  const msg = `ERROR: ${err.message}`;
  console.log(msg);
  res.json(msg);
})

module.exports = router;
