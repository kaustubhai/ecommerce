import React, { useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUserWishlist } from '../actions/userActions'
import ProductRow from '../components/ProductRow'
import Message from '../components/Message'

const Wishlist = ({ history }) => {
    const dispatch = useDispatch()
    const { wishlist } = useSelector(state => state.userUpdate)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

    useEffect(() => {
        dispatch(getUserWishlist())
    }, [dispatch])

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
  }, [
    dispatch,
    history,
    userInfo,
  ])

  return (
    <div>
        <h1>Wishlist</h1>
        <Table hover responsive className='table-sm'>
        {(wishlist.length === 0) ?
          <Message>
            Your wishlist is empty <Button variant='link' className='p-0' onClick={() => history.goBack()}>Go Back</Button>
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