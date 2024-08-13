const User = require('../models/User')


const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler (async (req, res) => {
      const users = await User.find().select('-password').lean();
      if (!users?.length) {
            return res.status(404).json({message : "No users found"})
      }
      res.status(200).json(users);
  });


// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const {username, password, roles} = req.body

    // Confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message : 'All fields are required'})
    }
    
    // Check for duplicate
    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate){
        return res.status(409).json({message : 'Duplicate username'})
    }


    const hashedPwd = await bcrypt.hash(password, 10) //salt rounds
    const userObject = {
        username,
        "password": hashedPwd,
        roles
    }

    // Create and store new user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({message: `New user ${username} created`});
    } else {
        res.status(400).json({message : 'Invalid user data received'})
    }

    
    
})


// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const {id, username, roles, password} = req.body

    //confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message : 'All fields are required'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message : 'User not found'})
    }


    // check for duplicate
    const duplicate = await User.findOne({username}).lean().exec()
    //Allow updates to the original user
    if(duplicate && duplicate?._id.toString()!== id){
         return res.status(409).json({message : 'Duplicate username'})
    }

    user.username = username
    user.roles = roles
    
    if (password) {
        user.password = await bcrypt.hash(password, 10) // salt rounds
    }

    const updatedUser = await user.save()

    
    res.status(201).json({message : `User ${username} updated`})
        
})


// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({message : 'User ID Required'})
    }

    const user = await User.findById(id).exec()

    if (!user){
       return res.status(400).json({message : 'User not found'})
    }

    const result = await user.deleteOne()

    const reply = `Username ${user.username} with ID ${user.id}`
    res.json(reply)

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}