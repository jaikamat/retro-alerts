var express = require('express');
var router = express.Router();
const User = require('../database/models/user');
const { ObjectId } = require('mongoose').Types; // Need to coerce some strings to ObjectId

/**
 * Aggregates all users or a single user, by performing a $lookup and matching UPC codes
 * @param {string} userId
 */
async function aggregateUsers(userId) {
  let matchy = {}; // Find all users

  if (userId) matchy = { _id: ObjectId(userId) }; // If userId provided, find specific user

  // TODO: This needs to only match if QOH > 0
  return await User.aggregate()
    .match(matchy)
    .unwind({
      path: '$wantlist',
      "preserveNullAndEmptyArrays": true
    })
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
    })
    // Ok, this is weird one. Unwinding on null arrays then performing a $lookup
    // and adding a 'match' property causes the unwound wantlist to be an object with a single property of 'match'
    // equalling an empty array (because no matching values were looked-up). So, when we group and $push the wantlist
    // previously, it pushes the single object into an array and this is the value: wantlist: [{ "match": [] }].
    // So, we check the first array element for that value after grouping and re-set it back to an empty array.
    .addFields({
      wantlist: {
        $cond: {
          if: { $eq: [{ $arrayElemAt: ['$wantlist', 0] }, { "match": [] }] }, // <- Resetting the value here
          then: [],
          else: '$wantlist'
        }
      }
    })
    // Again, it's kind of hacky but it works. TODO: Come back to this with a better solution!
    .sort({ lastname: 1 });
}

/**
 * Get all users and their subsequent matches
 */
router.get('/', async (req, res, next) => {
  try {
    const users = await aggregateUsers();
    res.json(users);
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

    const aggregate = await aggregateUsers(req.params.id)

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

    const aggregate = await aggregateUsers(id);

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

    const aggregate = await aggregateUsers(req.params.id)

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
