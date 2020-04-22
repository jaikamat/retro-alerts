var express = require('express');
var router = express.Router();
const User = require('../database/models/user');

/* GET users listing. */
router.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// GET specific user by name
router.get('/name', async (req, res, next) => {
  try {
    // Get user here
    res.json('get single user BY NAME')
  } catch (err) {
    next(err);
  }
})

// GET user product matches to inventory, for all users
router.get('/matches', async (req, res, next) => {
  try {
    const aggregate = await User.aggregate()
      .unwind('wantlist') // Separate each user out for each item in their wantlist
      .lookup({ // Map matches from the inventory to another field
        from: 'scraped_inventory',
        localField: 'wantlist.SKU',
        foreignField: 'systemSku',
        as: 'match'
      })
      .unwind('match') // lookup yields an array - unwind it into an object
      .addFields({ // Sum the qoh values on the ItemShop array onto each match property
        'match.totalQoh': {
          $reduce: {
            input: '$match.ItemShops.ItemShop',
            initialValue: 0,
            in: { $sum: ['$$value', { $toInt: '$$this.qoh' }] }
          }
        }
      })
      .group({ // Group by user information TODO: study this method more
        _id: '$_id',
        firstname: { $first: '$firstname' },
        lastname: { $first: '$lastname' },
        email: { $first: '$email' },
        phone: { $first: '$phone' },
        matches: { $push: '$match' } // Creates an array from all grouped, individual matches
      })
      .project({
        _id: 1,
        firstname: 1,
        lastname: 1,
        email: 1,
        phone: 1,
        wantlist: 1,
        'matches._id': 1,
        'matches.systemSku': 1,
        'matches.description': 1,
        'matches.ItemShops': 1,
        'matches.totalQoh': 1
      });

    res.json(aggregate);
  } catch (err) {
    next(err);
  }
})

// GET specific user by id
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
  const { firstname, lastname, email, phone, wantlist } = req.body;

  try {
    const user = new User({
      firstname,
      lastname,
      email,
      phone,
      wantlist
    });

    await user.save();

    res.json('User was supposed to be saved');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
