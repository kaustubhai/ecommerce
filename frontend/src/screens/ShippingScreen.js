import React, { useState, useEffect, useCallback } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'
import Helmet from 'react-helmet'
import { checkDelivery, updatePhone } from '../actions/shippingActions'

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart
  const { state, city, pincode, deliveryDays, error: deliveryError } = useSelector((state) => state.shipping)
  const { userInfo } = useSelector((state) => state.userLogin)
  const { error: phoneError } = useSelector(state => state.userUpdateProfile)
  const { phone: userPhone } = userInfo;
  const [address, setAddress] = useState('')
  const [address2, setAddress2] = useState('')
  const [postalCode, setPostalCode] = useState(pincode || shippingAddress.postalCode || '')
  const [country, setCountry] = useState(shippingAddress.country)
  const [deliverable, setDeliverable] = useState(false)
  const [alert, setAlert] = useState(false)
  const [phone, setPhone] = useState(userPhone || '')

  const dispatch = useDispatch()

  useEffect(() => {
    setAlert(phoneError)
  }, [phoneError])
  

  const submitHandler = async (e) => {
    e.preventDefault()
      dispatch(saveShippingAddress({ address: address + ', ' + address2, city, state, postalCode, country }))
      history.push('/placeorder')
  }

  const checkDeliveryHandler = useCallback(async (val) => {
    setPostalCode(val)
    if(val.length === 6){
      setAlert('Processing...')
      dispatch(checkDelivery(val));
    }
  }, [dispatch])

  useEffect(() => {
    checkDeliveryHandler(shippingAddress.postalCode)
  }, [checkDeliveryHandler, shippingAddress.postalCode])

  const updatePhoneNumber = async (val) => {
    setPhone(val)
    if(val.length === 10)
      dispatch(updatePhone(val))
  }

  useEffect(() => {
    if(deliveryError){
      setDeliverable(false)
      setAlert(deliveryError);
    }
    if(deliveryDays){
      setDeliverable(true)
      setAlert(`Estimated delivery in ${deliveryDays} days`);
    }
  }, [deliveryError, deliveryDays])


  return (
    <FormContainer>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Shipping | KroShop</title>
        <link rel="canonical" />
    </Helmet>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>

      <Form.Group controlId='postalCode'>
        <Form.Label>Postal Code</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter postal code'
          value={postalCode}
          required
          max={6}
          onChange={(e) => checkDeliveryHandler(e.target.value)}
          onBlur={(e) => checkDeliveryHandler(e.target.value)}
        ></Form.Control>
      </Form.Group>

      <Form.Group controlId='phone'>
        <Form.Label>Mobile Number</Form.Label>
        <Form.Control
          type='number'
          placeholder='Enter mobile number'
          step={1}
          value={phone}
          required
          maxLength={10}
          minLength={10}
          onChange={(e) => updatePhoneNumber(e.target.value)}
        ></Form.Control>
      </Form.Group>
        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Address Line 1'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
          <Form.Control
            type='text'
            placeholder='Address Line 2'
            value={address2}
            required
            className='mt-2'
            onChange={(e) => setAddress2(e.target.value)}
          ></Form.Control>
        </Form.Group>
        
        <Form.Group controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder={alert ? '...' :'Enter city'}
            value={city}
            required
            disabled
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='state'>
          <Form.Label>State</Form.Label>
          <Form.Control
            type='text'
            placeholder={alert ? '...' : 'Enter state'}
            value={state}
            required
            disabled
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='country'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter country'
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' disabled={!city || !(phone.length === 10) || phoneError} variant='primary' className='bg-danger'>
          {alert === 'Processing...' ? 'Loading' : 'Continue'}
        </Button>
      </Form>
    
      {alert && alert !== 'Processing...' && pincode && <Alert variant={deliverable && !phoneError ? 'success' : 'danger'} style={{marginTop: '10px'}}>
        {alert}
      </Alert>}
    </FormContainer>
  )
}

export default ShippingScreen
