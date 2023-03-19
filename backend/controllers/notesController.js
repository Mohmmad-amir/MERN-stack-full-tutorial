const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler');


/*
* @desc Get all notes
* @route GET /notes
* @access Private
*/
const index = asyncHandler(async (req, res) => {
    //get all notes from mongodb
    const notes = await Note.find().lean()
    //if no notes
    if (!notes?.length) {
        return res.status(400).json({
            message: 'No notes Found'
        })
    }
    // Add username to each note before sending the response 
    const noteWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(noteWithUser)
})

/*
* @desc create new note
* @route POST /notes
* @access Private
*/
const store = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    //confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    //check for duplicate
    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate title' })
    }


    // create and store new user
    const note = await Note.create({ user, title, text })
    if (note) { //created
        res.status(201).json({ message: 'New note created' })
    } else {
        res.status(400).json({ message: 'Invalid note data received' })

    }
})

/*
* @desc update a note
* @route PATCH /notes
* @access Private
*/
const update = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body
    // confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    //confirm note exists to update
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }
    // check duplicate
    const duplicate = await Note.findOne({ title }).lean().exec()
    // allow update to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' })

    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed


    const updateNote = await note.save()
    res.json({ message: `${updateNote.title} updated` })
})

/*
* @desc delete a user
* @route DELETE /users
* @access Private
*/
const destroy = asyncHandler(async (req, res) => {
    const { id } = req.body
    //confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note id required' })
    }

    const result = await Note.deleteOne()
    const reply = `Note : ${result.title} with ID : ${result._id} Deleted`
    res.json(reply)
})

module.exports = {
    index,
    store,
    update,
    destroy
};


