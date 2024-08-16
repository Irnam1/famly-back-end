const express = require('express')
const router = express.Router()
const outingsController = require('../controllers/outingsController')

router.route('/')
    .get(outingsController.getAllOutings)
    .post(outingsController.createNewOuting)
    .patch(outingsController.updateOuting)
    .delete(outingsController.deleteOuting)

module.exports = router