import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Card } from 'react-bootstrap'
import Rating from './Rating'

const Product = ({ product }) => {
  const [img, setImg] = useState('')
  useEffect(() => {
    setImg(product.image)
  }, [product, product.image])
  return (
    <Card className='my-3 rounded'>

      <Link to={`/product/${product._id}`} className='product-img-container'>
        <Card.Img height={'200px'} onMouseEnter={() => setImg(product.secondaryImage || product.image)} onMouseLeave={() => setImg(product.image)} className={'product-img'} src={img} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        {/* <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
          </Card.Text> */}
        <Card.Text as='h3' className='pb-1 mb-0'>₹{product.discount ? (product.price - (product.discount * product.price / 100).toFixed(0))?.toLocaleString('en-IN') : product.price?.toLocaleString('en-IN')}</Card.Text>

        {( product.discount || (product.mrp !== product.price)) && (
        <Badge variant='danger'>
          SALE
        </Badge>
      )}
      </Card.Body>
    </Card>
  )
}

export default Product
