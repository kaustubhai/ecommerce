import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { Helmet } from 'react-helmet'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword } from '../actions/userActions'
const RequestPassword = ({ location, history}) => {
  const userUpdate = useSelector((state) => state.userUpdate)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const {
    loading,
    error,
  } = userUpdate
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(forgotPassword(email))
        setMessage('You will receive an email shortly with instructions on how to reset your password.')
    }
  return (
    <FormContainer>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Forgot Password | ProShop</title>
        <link rel="canonical" />
    </Helmet>
        <Row className='py-3'>
            {message && <Message>
                {message}
            </Message>}
            {error && <Message variant={'danger'}>
                {error}
            </Message>}
        </Row>
      <h1>Forgot Password</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Request Password
        </Button>
      </Form>
    </FormContainer>
  )
}

export default RequestPassword