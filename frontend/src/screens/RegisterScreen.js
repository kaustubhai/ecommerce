import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'
import Helmet from 'react-helmet'

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
      dispatch(register(name, email, password, phone))
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
            style={{ display: "inline-block" }}
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            ></Form.Check>
            <Form.Label
            style={{ display: "inline-block" }}
            >
              I agree to <a href="#!">Terms & Conditions</a>
            </Form.Label>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Register
        </Button>
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
