import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({ history, closeModal}) => {
  const [keyword, setKeyword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      history.push(`/search/${keyword}`)
    } else {
      history.push('/')
    }
  }

  return (
    <Form onSubmit={submitHandler} className ="positionSearch" inline>      
      <Form.Control
        type='text'
        name='form'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search...'
        className='mr-sm-2 ml-sm-5'
      >
      </Form.Control>
      <Button className="searchBtn" onClick={closeModal}>
      <i class="fas fa-times"></i>
      </Button>
    </Form>
  )
}

export default SearchBox
