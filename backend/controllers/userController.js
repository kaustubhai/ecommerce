import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import emailer from '../utils/mailConfig.js'
import generateTemplate from '../utils/resetPasswordMail.js'
import generateNewsletter from '../utils/newsletterMail.js'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    res.status(400)
    throw new Error('User not found')
  }
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else if (user.mode === 'gmail') {
    res.status(401)
    throw new Error('Login with google')
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, newsletter, mode } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    newsletter,
    mode
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mode: user.mode,
      isAdmin: user.isAdmin,
      newsLetter: user.newsLetter,
      phone: user.phone,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.phone = req.body.phone || user.phone
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id)
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

const forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'No User Founded' })
    const payload = {
      password: user.password
    }
    const token = jwt.sign(payload, user.password, {
      expiresIn: 3600
    })
    emailer({
      to: email,
      subject: 'Reset Password',
      body: generateTemplate(token, user._id.toString())
    })
    res.json('Mail sent!')
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

const resetPassword = async (req, res) => {
  let tokenValid = true
  try {
    const { password } = req.body
    const { uId } = req.query
    const user = await User.findById(uId)
    const token = req.params.requestId
    jwt.verify(token, user.password, (err) => {
      if (err) {
        console.log({ err })
        tokenValid = false
        return res.status(400).json({ message: 'Link Expired, Try again!' })
      }
    })
    if (tokenValid) {
      user.password = password
      user.mode = 'email'
      await user.save()
      res.json({ message: 'Password Changed Succesfully' })
    }
  } catch (error) {
    console.log(error)
    if (tokenValid) res.status(500).json({ message: 'Internal Server Error' })
  }
}

const getUserWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist')
    const wishlist = user.wishlist.reverse()
    res.json(wishlist)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

const updateUserWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    const user = await User.findById(req.user._id)
    const product = await Product.findById(productId)
    if (!user.wishlist.includes(productId)) { user.wishlist.push(productId) }
    await user.save()
    res.json({ product })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

const removeUserWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    console.log(productId)
    const user = await User.findById(req.user._id)
    user.wishlist = user.wishlist.filter((id) => id !== productId)
    await user.save()
    res.send(productId)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

const sendNewletter = async (req, res) => {
  try {
    const users = await User.find({ newsletter: true }, 'email')
    const { subject, body } = req.body
    users.forEach((user) => {
      emailer({
        to: user.email,
        subject,
        body: generateNewsletter(JSON.parse(body))
      })
    }
    )
    res.json('Mail sent!')
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

const updatePhoneNumber = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  user.phone = req.body.phone
  console.log(user.phone)
  await user.save()
  res.json(user)
})

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPasswordRequest,
  resetPassword,
  getUserWishlist,
  updateUserWishlist,
  removeUserWishlist,
  sendNewletter,
  updatePhoneNumber
}
