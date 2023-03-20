import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'

// Net sale this FY
const getNetSaleThisFY = async (req, res) => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth()
  let start, end
  if (month < 3) {
    start = new Date(year - 1, 3, 1)
    end = new Date(year, 2, 31)
  } else {
    start = new Date(year, 3, 1)
    end = new Date(year + 1, 2, 31)
  }
  const orders = await Order.find({
    createdAt: {
      $gte: start,
      $lte: end
    }
  })
  const netSale = orders.reduce((acc, order) => acc + order.totalPrice, 0)
  res.json(netSale)
}
// Net sale this month
const getNetSaleThisMonth = async (req, res) => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth()
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)
  const orders = await Order.find({
    createdAt: {
      $gte: start,
      $lte: end
    }
  })
  const netSale = orders.reduce((acc, order) => acc + order.totalPrice, 0)
  res.json(netSale)
}
// Out of stock products
const getOutOfStockProducts = async (req, res) => {
  const products = await Product.find({
    countInStock: 0
  })
  res.json(products)
}
// Low in stock products
const getLowInStockProducts = async (req, res) => {
  const products = await Product.find({
    countInStock: {
      $gt: 0,
      $lt: 5
    }
  })
  res.json(products)
}
// New user onboarded this month
const getNewUserOnboardedThisMonth = async (req, res) => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth()
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)
  const users = await User.find({
    createdAt: {
      $gte: start,
      $lte: end
    }
  }).count()
  res.json(users)
}
// Processing orders count
const getProcessingOrdersCount = async (req, res) => {
  const orders = await Order.find({
    isPaid: true,
    isDispatched: false
  }).count()
  res.json(orders)
}

export {
  getNetSaleThisFY,
  getNetSaleThisMonth,
  getOutOfStockProducts,
  getLowInStockProducts,
  getNewUserOnboardedThisMonth,
  getProcessingOrdersCount
}
