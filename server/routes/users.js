var express = require('express');
var router = express.Router();
const User = require('../database/models/user');

/**
 * Get all users
 */
router.get('/', async (req, res) => {
  try {
    res.json(await User.find({}));
  } catch (err) {
    next(err);
  }
});

/**
 * Get a user by name (firstname, lastname)
 */
router.get('/name', async (req, res, next) => {
  const { firstname, lastname } = req.query;

  try {
    res.json(await User.findOne({ firstname, lastname }))
  } catch (err) {
    next(err);
  }
})

/**
 * Get users who have matching inventory UPC's
 * that match items in their wantlist
 */
router.get('/matches', async (req, res, next) => {
  try {
    const aggregate = await User.aggregate()
      .unwind('wantlist') // Separate each user out for each item in their wantlist
      .lookup({ // Map matches from the inventory to another field
        from: 'scraped_inventory',
        localField: 'wantlist.itemId',
        foreignField: 'upc',
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
        'matches.upc': 1,
        'matches.description': 1,
        'matches.ItemShops': 1,
        'matches.totalQoh': 1
      });

    res.json(aggregate);
  } catch (err) {
    next(err);
  }
})

/**
 * Get a user by id
 */
router.get('/:id', async (req, res, next) => {
  try {
    res.json(await User.findOne({ _id: req.params.id }))
  } catch (err) {
    next(err);
  }
})

/**
 * Get a user's wantlist, by user id
 */
router.get('/:id/wantlist', async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    res.json(user.wantlist);
  } catch (err) {
    next(err);
  }
})

/**
 * Edit a user's wantlist (add/remove)
 */
router.post('/:id/wantlist', async (req, res, next) => {
  try {
    // Post user wantlist here
    res.json('post wantlist')
  } catch (err) {
    next(err);
  }
})

/**
 * Create a new user
 */
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

    res.json(await user.save());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
