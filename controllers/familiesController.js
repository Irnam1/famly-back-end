const Family = require('../models/Family')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


// @desc Get all families
// @route GET /families
// @access Private
const getAllfamilies = asyncHandler (async(req, res)=>{
    const families = await Family.find().lean()
    if (!families?.length){
        return res.status(404).json({message : "No families found"})
    }
    res.status(200).json(families)
})

// @desc Create new family
// @route POST /families
// @access Private
const createNewFamily = asyncHandler (async(req, res)=>{
    const {name, description} = req.body

    // confirm data
    if (!name || typeof description !== "string") {
        return res.status(400).json({message : "All fields is required"})
    }

    // check for duplicate
    const duplicate = await Family.findOne({name}).lean().exec()
    if(duplicate) {
        return res.status(409).json({message : "Duplicate family name"})
    }

    const familyObject = {
        name,
        description
    }

    // create and store new family
    const family = await Family.create(familyObject)

    if (family) {
        res.status(201).json({message : `Family ${name} created`})
    } else {
        res.status(400).json({message : 'Invalid family data received'})
    }
})

// @desc Update a family
// @route PATCH /families
// @access Private
const updateFamily = asyncHandler (async(req, res)=>{
    const {id, name, description} = req.body

    // confirm data
    if (!id || !name) {
        res.status(400).json({message : "All fields are required"})
    }

    const family = await Family.findById(id).exec()

    if (!family) {
        res.status(400).json({message : "Family not found"})
    }

    // check for duplicate
    const duplicate = await Family.findOne({name}).lean().exec()

    // Allow updates to the original family 
    if (duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message : "Duplicate name"})
    }

    family.name = name
    
    if(description) {
        family.description = description
    }

    const updatedFamily = await family.save()

    res.json({message : `Family ${name} updated`})

})


// @desc Delete a family
// @route DELETE /families
// @access Private
const deleteFamily = asyncHandler (async(req, res)=>{
    const { id } = req.body

    if(!id){
       return res.status(400).json({message : 'Family ID required'})
    }

    const family = await Family.findById(id).exec()

    if (!family) {
       return res.status(400).json({message : "Family not found"})
    }

    const result = await family.deleteOne()

    const reply = `Family ${family.name} with ID ${family.id} deleted`
    res.json(reply)
})

module.exports = {
    getAllfamilies,
    createNewFamily,
    updateFamily,
    deleteFamily
}