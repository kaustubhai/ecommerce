import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import XLSX from 'xlsx'
import formidable from 'formidable'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i'
        }
      }
    : {}

  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id }
  })
    .limit(4)
    .sort({ createdAt: -1 })

  product.relatedProducts = relatedProducts

  if (product) {
    res.json({ ...product._doc, relatedProducts })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    mrp: 0,
    discount: 0,
    image: '/images/sample.jpg',
    secondaryImage: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
    tags: ['sample', 'tag']
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    List all Category
// @route   GET /api/categories
// @access  Public
const getAllCategory = asyncHandler(async (req, res) => {
  const category = await Product.distinct('category')
  res.json(category)
})

// @desc    Fetch from specific Category
// @route   GET /api/category/:category
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const { category } = req.params
  if (!category) {
    res.status(404).json({ message: 'Category not found' })
  }
  const products = await Product.find({ category })
  if (products.length === 0) {
    res.status(404).json({ message: 'Category not found' })
  }
  res.json(products)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    mrp,
    discount,
    description,
    image,
    secondaryImage,
    brand,
    category,
    countInStock,
    tags
  } = req.body

  const product = await Product.findById(req.params.id)

  const tages = tags.split(',').map((tag) => tag.trim())

  if (product) {
    product.name = name
    product.mrp = mrp
    product.price = price || mrp
    product.discount = discount
    product.description = description
    product.image = image
    product.secondaryImage = secondaryImage
    product.brand = brand
    product.category = category.toLowerCase().trim()
    product.countInStock = countInStock
    product.tags = tages

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4)

  res.json(products)
})

const bulkUpload = asyncHandler(async (req, res) => {
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    if (err) {
      console.log(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
    const f = files[Object.keys(files)[0]]
    const workbook = XLSX.readFile(f.filepath)
    let tableHeader = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
      {
        header: 1
      }
    )
    tableHeader = tableHeader[0];
    [
      'name',
      'image',
      'secondaryImage',
      'brand',
      'category',
      'description',
      'price',
      'mrp',
      'discount',
      'countInStock',
      'tags'
    ].forEach((item) => {
      if (tableHeader.indexOf(item) === -1) {
        res
          .status(400)
          .json({ message: `"${item}" column is missing/misspelled` })
      }
    })
    let tableData = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
      {
        header: tableHeader
      }
    )
    tableData = tableData.map((item) => {
      item.user = req.user._id
      item.category = item.category.toLowerCase().trim()
      item.tags = item.tags.split(',').map((tag) => tag.trim())
      return item
    })
    tableData.shift()
    await Product.insertMany(tableData)
    res.status(200).json({ message: 'File Uploaded Successfully' })
  })
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  getAllCategory,
  getCategory,
  updateProduct,
  createProductReview,
  getTopProducts,
  bulkUpload
}
