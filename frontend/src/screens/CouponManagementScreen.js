import React, { useEffect, useState } from 'react'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { addCoupon, deleteCoupon, getCoupon } from '../actions/cartActions'

const CouponManagementScreen = ({ history }) => {
  const dispatch = useDispatch()
	const [code, setCode] = useState('')
	const [discount, setDiscount] = useState('')
	const [maximum, setMaximum] = useState('')

  const couponsList = useSelector((state) => state.couponsList)
  const { loading, error, coupons } = couponsList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDelete = useSelector((state) => state.userDelete)
  const { success: successDelete } = userDelete

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getCoupon())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, successDelete, userInfo])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteCoupon(id))
    }
  }

  return (
    <>
      <h1>Coupons</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>CODE</th>
              <th>DISCOUNT %</th>
              <th>MAXIMUM ₹</th>
              <th></th>
            </tr>
            <tr>
              <th>
                <input
                  type='text'
                  placeholder='Enter code'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className='form-control'
                ></input>
              </th>
              <th>
                <input
                  type='text'
                  placeholder='Enter discount'
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className='form-control'
                ></input>
              </th>
              <th>
                <input
                  type='text'
                  placeholder='Enter maximum discount'
                  value={maximum}
                  onChange={(e) => setMaximum(e.target.value)}
                  className='form-control'
                ></input>
              </th>
              <th>
                <Button
                  type='submit'
                  onClick={() => dispatch(addCoupon(code, discount, maximum))}
                  variant='outline-success'
                  className='p-2'
                >
                  Add
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon.code}</td>
                <td>{coupon.discount}</td>
                <td>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(coupon.code)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default CouponManagementScreen
 