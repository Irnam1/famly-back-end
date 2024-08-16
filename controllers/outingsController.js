const Outing = require('../models/Outing')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all outings
// @route GET /outings
// @access Private
const getAllOutings = asyncHandler (async (req, res) => {
    const outings = await Outing.find().lean()
    if (!outings?.length){
        return res.status(404).json({message : "No outings found"})
    }
    res.status(200).json(outings)
})

// @desc Create new outing
// @route POST /outings
// @access Private
const createNewOuting = asyncHandler (async (req, res) => {
    const {title, description, location, budget, date} = req.body

    // confirm data
    if (!title || !description || !location || !date || !budget || typeof budget !== "number") {
       return res.status(400).json({message : "All fields required"})
    }

  
    // check for duplicate
    const duplicate = await Outing.findOne({date}).lean().exec()

    if(duplicate){
       return res.status(409).json({message : "Duplicate outing. No need to create this one."})
    } 
    
    const outingObject = {
        title,
        description,
        location,
        budget,
        date
    }


    // create and store new outing
    const outing = await Outing.create(outingObject)

    if (outing) {
        res.status(201).json({message : `New outing ${title} created`})
    } else {
        res.status(400).json({message : "Invalid outing data received"})
    }
})

// @desc update outing
// @route PATCH /outings
// @access Private
const updateOuting = asyncHandler (async (req, res) => {
    const { id, title, description, location, budget } = req.body

    if (!id || !title){
      return  res.status(400).json({message : "All fields required"})
    }

    const outing = await Outing.findById(id).exec()

    if ( !outing ) {
       return res.status(400).json({ message : "Outing not found" })
    }

    // check for duplicates 
    const duplicate = await Outing.findOne({title, budget, location}).lean().exec()

    // allow updates to the original outing
    if (duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message : "Duplicate outing"})
    }

    outing.title = title
    outing.description = description
    outing.budget = budget 
    outing.location = location

    const updatedOuting = await outing.save()

    res.json({ message : `Outing ${title} updated` })
})

// @desc delete outing
// @route DELETE /outings
// @access Private
const deleteOuting = asyncHandler (async (req, res) => {
    const { id } = req.body

    if(!id){
       return res.status(400).json({message : "Outing ID required"})
    }

    const outing = await Outing.findById(id).exec()

    if(!outing){
        return res.status(400).json({ message : "Outing not found"})
    }

    const result = await outing.deleteOne()
    const reply = `Outing ${outing.title} with ID ${outing.id} deleted`

    res.json(reply)
})


module.exports = {
    getAllOutings,
    createNewOuting,
    updateOuting,
    deleteOuting
}