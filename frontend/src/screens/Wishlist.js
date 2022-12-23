import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUserWishlist, removeFromUserWishlist } from '../actions/userActions'
import ProductRow from '../components/ProductRow'
import Message from '../components/Message'
import { Link } from 'react-router-dom'

const Wishlist = ({ history }) => {
    const dispatch = useDispatch()
    const { wishlist } = useSelector(state => state.userUpdate)
    useEffect(() => {
        dispatch(getUserWishlist())
    }, [])
  return (
    <div>
        <h1>Wishlist</h1>
        <Table hover responsive className='table-sm'>
        {(wishlist.length === 0) ?
          <Message>
            Your wishlist is empty <Link to='/'>Go Back</Link>
          </Message>
          :
        wishlist?.map((item) => (
            <ProductRow item={item} history={history} wishlist={true} />
        ))}
        </Table>
    </div>
  )
}

export default Wishlist