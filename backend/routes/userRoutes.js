const express = require('express');
const router = express.Router()
const usersController = require('../controllers/usersController')

router.route('/')
    .get(usersController.index)
    .post(usersController.store)
    .patch(usersController.update)
    .delete(usersController.destroy)



module.exports = router






