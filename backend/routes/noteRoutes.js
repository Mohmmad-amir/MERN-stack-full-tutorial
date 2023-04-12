const express = require('express');
const router = express.Router()
const notesController = require('../controllers/notesController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT)

router.route('/')
    .get(notesController.index)
    .post(notesController.store)
    .patch(notesController.update)
    .delete(notesController.destroy)



module.exports = router






