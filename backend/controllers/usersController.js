const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

/*
* @desc Get all users
* @route GET /users
* @access Private
*/
const index = asyncHandler(async (req, res) => {

    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({
            message: 'No users Found'
        })
    }
    res.json(users)
})

/*
* @desc create new user
* @route POST /users
* @access Private
*/
const store = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    //confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    //check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10) //salt rounds
    const userObject = { username, "password": hashedPassword, roles }

    // create and store new user
    const user = await User.create(userObject)
    if (user) { //created
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })

    }
})

/*
* @desc update a user
* @route PATCH /users
* @access Private
*/
const update = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body
    // confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'user not found' })
    }
    // check duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    // allow update to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })

    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        //hash password
        user.password = await bcrypt.hash(password, 10) //salt rounds
    }

    const updatedUser = await user.save()
    res.json({ message: `${updatedUser.username} updated` })
})

/*
* @desc delete a user
* @route DELETE /users
* @access Private
*/
const destroy = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'user id required' })
    }

    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User Not Found' })
    }
    const result = await user.deleteOne()
    const reply = `Username : ${result.username} with ID : ${result._id} Deleted`
    res.json(reply)
})

module.exports = {
    index,
    store,
    update,
    destroy
};


