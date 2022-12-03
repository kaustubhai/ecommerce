import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUserWishlist, removeFromUserWishlist } from '../actions/userActions'
import ProductRow from '../components/ProductRow'

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
        {wishlist?.map((item) => (
            <ProductRow item={item} history={history} />
        ))}
        </Table>
    </div>
  )
}

export default Wishlist