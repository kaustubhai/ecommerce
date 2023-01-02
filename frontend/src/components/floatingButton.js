import React from 'react'
import { useSelector  } from 'react-redux'
import { Link } from 'react-router-dom'

const FloatingButton = ({ history }) => {
    const cart = useSelector((state) => state.cart)
    const { cartItems } = cart
  return (
    <Link to={'/cart'} className='floatingButton d-print-none'>
        <p className='layover'>{cartItems.length}</p>
        <i className='fas fa-shopping-cart'></i>
    </Link>
  )
}

export default FloatingButton