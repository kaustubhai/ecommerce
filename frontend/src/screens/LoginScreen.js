import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login, googleLogin } from '../actions/userActions'
import GoogleLogin from 'react-google-login'
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
      <Col sm={12} md={2} className='d-flex align-items-center' style={{minHeight: '50px'}}>
        OR
      </Col>
      <Col sm={12} md={6} className='d-flex justify-content-md-end justify-content-sm-start'>
      <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          render={renderProps => (
            <Button className="text-right"
            style={{ padding: '0'}}
              onClick={() => {
                renderProps.onClick()
              }}
            >
              <Button
                type="button"
                variant='Primary'
                style={{ color: '#ffffff', backgroundColor: '#ff5555' }}
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="mr-2"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
                </svg>
                Sign in with Google
              </Button>
            </Button>
          )}
          onSuccess={responseGoogle}
          onFailure={loginError}
        />
      </Col>
      </Row>
      </Form>
      <Row className='py-3'>
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
