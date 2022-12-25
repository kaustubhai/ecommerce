import React, { useState, useEffect } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'
import Helmet from 'react-helmet'
import { checkDelivery } from '../actions/productActions'

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  const [address, setAddress] = useState('')
  const [address2, setAddress2] = useState('')
  const [state, setState] = useState(shippingAddress.state)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(shippingAddress.country)
  const [deliverable, setDeliverable] = useState(false)
  const [alert, setAlert] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    checkDeliveryHandler()
  }, [shippingAddress.postalCode])
  

  const submitHandler = async (e) => {
    e.preventDefault()
      dispatch(saveShippingAddress({ address: address + ', ' + address2, city, state, postalCode, country }))
      history.push('/placeorder')
  }

  const checkDeliveryHandler = async () => {
    if(postalCode && postalCode !== deliverable){
    setAlert('Processing...')
    setState('')
    setCity('')
    const delieryCheck = await checkDelivery(postalCode)
    setDeliverable(postalCode)
    if(delieryCheck){
        setState(delieryCheck.state)
        setCity(delieryCheck.city)
        setAlert(false)
    } else{
        setAlert("Sorry! This pincode is not covered by us.")
    }}
  }

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
          onBlur={checkDeliveryHandler}
          onChange={(e) => setPostalCode(e.target.value)}
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

        <Button type='submit' disabled={!city} variant='primary' className='bg-danger'>
          {alert === 'Processing...' ? 'Loading' : 'Continue'}
        </Button>
      </Form>
    {alert && alert !== 'Processing...' && <Alert variant='danger' style={{marginTop: '10px'}}>
        {alert}
      </Alert>}
    </FormContainer>
  )
}

export default ShippingScreen
