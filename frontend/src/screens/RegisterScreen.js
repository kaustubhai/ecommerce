import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { googleRegister, register } from '../actions/userActions'
import Helmet from 'react-helmet'
import GoogleLogin from 'react-google-login'
const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newsLetter, setNewsLetter] = useState(true)
  const [terms, setTerms] = useState(true)
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  const redirect = location.search ? location.search.split('=')[1] : '/'

  const responseGoogle = async response => {
    dispatch(googleRegister(response))
    // history.push('/')
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
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else if(phone.length !== 10 || ['9', '8', '7', '6'].indexOf(phone.toString().charAt(0)) === -1) {
      setMessage('Phone number is not valid')
    } else if(!terms) {
      setMessage('Please accept the terms and conditions')
    } else {
      dispatch(register(name, email, password, phone, newsLetter))
    }
  }

  return (
    <FormContainer>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Register | KroShop</title>
        <link rel="canonical" />
    </Helmet>
      <h1>Sign Up</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            ></Form.Control>
        </Form.Group>

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

        <Form.Group controlId='phone'>
              <Form.Label>Mobile Number</Form.Label>
                <div className='flex'>
                <Form.Control
                  as='select'
                  value={'+91'}
                  style={{ width: "25%", display: "inline-block", marginRight: "2%" }}
                >
                  <option value='+91'>+91</option>
                </Form.Control>
                <Form.Control
                  type='number'
                  id="phone"
                  step="1"
                  placeholder='Enter Phone Number'
                  style={{ width: "73%", display: "inline-block" }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  />
                  </div>
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

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            ></Form.Control>
        </Form.Group>

        <Form.Group controlId='newsLetter'>
          <Form.Check
            type='checkbox'
            label='Subscribe to our newsletter'
            checked={newsLetter}
            onChange={(e) => setNewsLetter(e.target.checked)}
            ></Form.Check>
        </Form.Group>

        <Form.Group controlId='terms'>
          <Form.Check
            type='checkbox'
            className='d-inline-block'
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            ></Form.Check>
            <Form.Label
            className='d-inline-block'
            >
              I agree to <a href="#!">Terms & Conditions</a>
            </Form.Label>
        </Form.Group>
    <Row>
      <Col sm={12} md={4}>
        <Button type='submit' variant='primary'>
          Register
        </Button>
      </Col>
          <Col sm={12} md={2} className='d-flex align-items-center min-h-50'>
        OR
      </Col>
      <Col sm={12} md={6} className='d-flex justify-content-md-end justify-content-sm-start'>
      <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          render={renderProps => (
            <Button className="text-right ml-3 p-0"
              onClick={() => {
                renderProps.onClick()
              }}
            >
              <Button
                type="button"
                variant='Primary'
                className='google-login-btn'
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
                Register with Google
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
          Have an Account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
