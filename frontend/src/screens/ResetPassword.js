import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { Helmet } from 'react-helmet'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { resetPassword } from '../actions/userActions'

const ResetPassword = ({ match, location, history }) => {
  const userUpdate = useSelector((state) => state.userUpdate)
  const {
    loading,
    error,
    success
  } = userUpdate;
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const dispatch = useDispatch()
    const uid = location.search.split('=')[1]
    const token = match.params.token;

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin
  
    const redirect = location.search ? location.search.split('=')[1] : '/'
  
    useEffect(() => {
      if (userInfo) {
        history.push(redirect)
      }
    }, [history, userInfo, redirect])

    const checkPassword = () => {
        if (error) {
            setErrorPassword(error)
            return false;
        }
        else if (password !== passwordConfirm) {
            setErrorPassword('Passwords do not match')
            return false;
        } else if (password.length < 8) {
            setErrorPassword('Password must be at least 8 characters')
            return false;
        } else {
            setErrorPassword('')
            return true;
        }
    }
    const submitHandler = async (e) => {
        e.preventDefault()
        const proceed = checkPassword()
        if (proceed) {
          await dispatch(resetPassword(token, uid, password))
          if(success){
            alert('Password reset successfully')
              history.push('/login')
            }
        }
    }
  return (
    <FormContainer>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Reset Password | KroShop</title>
        <link rel="canonical" />
    </Helmet>
      <Row className='py-3'>
          {errorPassword && <Message variant={'danger'}>
              {errorPassword}
          </Message>}
          {error && <Message variant={'danger'}>
              {error}
          </Message>}
      </Row>
      <h1>Reset Password</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='password'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='confirm-password'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm Password'
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Reset Password
        </Button>
      </Form>
      <Row className='py-3'>
        { loading && <Loader />}
        </Row>
    </FormContainer>
  )
}

export default ResetPassword