var express = require('express');
var router = express.Router();
const User = require('../database/models/user');
const { ObjectId } = require('mongoose').Types; // Need to coerce some strings to ObjectId

/**
 * Get all users and their subsequent matches
 */
router.get('/', async (req, res, next) => {
  try {
    // TODO: This needs to only match if QOH > 0
    const aggregate = await User.aggregate()
      .unwind('wantlist')
      .lookup({
        from: 'scraped_inventory',
        localField: 'wantlist.itemId',
        foreignField: 'upc',
        as: 'wantlist.match'
      })
      .group({
        _id: '$_id',
        firstname: { $first: '$firstname' },
        lastname: { $first: '$lastname' },
        email: { $first: '$email' },
        phone: { $first: '$phone' },
        wantlist: { $push: '$wantlist' }
      });

    res.json(aggregate);
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
      .unwind('match') // .lookup() yields an array - unwind it into an object
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
 * Add item to user wantlist
 */
router.post('/:id/wantlist', async (req, res, next) => {
  const { title, itemId } = req.body;

  try {
    const user = await User.findOne({ _id: req.params.id });
    user.wantlist.push({ itemId, title });
    await user.save();

    const aggregate = await User.aggregate()
      .match({ _id: ObjectId(req.params.id) })
      .unwind('wantlist')
      .lookup({
        from: 'scraped_inventory',
        localField: 'wantlist.itemId',
        foreignField: 'upc',
        as: 'wantlist.match'
      })
      .group({
        _id: '$_id',
        firstname: { $first: '$firstname' },
        lastname: { $first: '$lastname' },
        email: { $first: '$email' },
        phone: { $first: '$phone' },
        wantlist: { $push: '$wantlist' }
      });

    res.json(aggregate[0]);

  } catch (err) {
    next(err);
  }
})

/**
 * Set wantlist item as pending
 */
router.post('/:id/wantlist/:wantlistItemId', async (req, res, next) => {
  const { setPending } = req.body;
  const { id, wantlistItemId } = req.params;

  try {
    const user = await User.findOne({ _id: id });

    const indexToSet = user.wantlist.findIndex(el => el._id.equals(wantlistItemId)); // .equals() is a function exposed on the ObjectId mongo datatype object
    user.wantlist[indexToSet].pending = setPending; // Set the value through mutation

    await user.save();

    const aggregate = await User.aggregate()
      .match({ _id: ObjectId(req.params.id) })
      .unwind('wantlist')
      .lookup({
        from: 'scraped_inventory',
        localField: 'wantlist.itemId',
        foreignField: 'upc',
        as: 'wantlist.match'
      })
      .group({
        _id: '$_id',
        firstname: { $first: '$firstname' },
        lastname: { $first: '$lastname' },
        email: { $first: '$email' },
        phone: { $first: '$phone' },
        wantlist: { $push: '$wantlist' }
      });

    res.json(aggregate[0]);
  } catch (err) {
    next(err);
  }
})

/**
 * Remove item from user wantlist
 */
router.delete('/:id/wantlist/:wantlistItemId', async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    user.wantlist.pull({ _id: req.params.wantlistItemId });
    await user.save();

    const aggregate = await User.aggregate()
      .match({ _id: ObjectId(req.params.id) })
      .unwind('wantlist')
      .lookup({
        from: 'scraped_inventory',
        localField: 'wantlist.itemId',
        foreignField: 'upc',
        as: 'wantlist.match'
      })
      .group({
        _id: '$_id',
        firstname: { $first: '$firstname' },
        lastname: { $first: '$lastname' },
        email: { $first: '$email' },
        phone: { $first: '$phone' },
        wantlist: { $push: '$wantlist' }
      });

    res.json(aggregate[0]);
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

/**
 * Delete a single user from the database
 */
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    res.json(await User.deleteOne({ _id: id }));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
