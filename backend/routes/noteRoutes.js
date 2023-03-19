const express = require('express');
const router = express.Router()
const notesController = require('../controllers/notesController')

router.route('/')
    .get(notesController.index)
    .post(notesController.store)
    .patch(notesController.update)
    .delete(notesController.destroy)



module.exports = router






