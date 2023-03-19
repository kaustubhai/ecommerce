import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login, googleLogin } from '../actions/userActions'
import { GoogleLogin } from '@react-oauth/google'
import Helmet from 'react-helmet'

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  const responseGoogle = async response => {
    dispatch(googleLogin(response, history, redirect))
  }

  const loginError = (response) => {
    if (response.error !== 'popup_closed_by_user') {
      console.log({
        loginError: response
      })
    }
  }

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sign In | KroShop</title>
        <link rel="canonical" />
      </Helmet>
      <h1>Sign In</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
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

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Row>
          <Col sm={12} md={4}>
            <Button type='submit' variant='primary'>
              Sign In
            </Button>
          </Col>
          <Col sm={12} md={2} className='d-flex align-items-center min-h-50'>
            OR
          </Col>
          <Col sm={12} md={6} className='d-flex justify-content-md-end justify-content-sm-start'>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              size='large'
              useOneTap
              onSuccess={responseGoogle}
              onError={loginError}
              type='standard'
              ux_mode='popup'
              logo_alignment='right'
            />
          </Col>
        </Row>
      </Form>
      <Row className='pt-5 pb-2'>
        <Col>
          Forgot password?{' '}
          <Link to='/user/password/forget'>
            Reset it.
          </Link>
        </Col>
      </Row>
      <Row >
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
