const express = require('express')
const router = express.Router()
const familiesController = require('../controllers/familiesController')

router.route('/')
    .get(familiesController.getAllfamilies)
    .post(familiesController.createNewFamily)
    .patch(familiesController.updateFamily)
    .delete(familiesController.deleteFamily)

module.exports = router