const express = require('express');
const router = express.Router()
const usersController = require('../controllers/usersController')

const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT)

router.route('/')
    .get(usersController.index)
    .post(usersController.store)
    .patch(usersController.update)
    .delete(usersController.destroy)



module.exports = router






