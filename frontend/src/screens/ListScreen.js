import React, { useEffect, useState } from 'react'
import { Row, Col, Table, Spinner, Button, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Product from '../components/Product'
import { getProductsByCategory, listProducts } from '../actions/productActions'
import ProductRow from '../components/ProductRow'

const ListScreen = ({ history, match }) => {
    const keyword = match.params.keyword

    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch()

    const productList = useSelector((state) => state.productList)
    const { loading, error, products, page, pages } = productList

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber))
    }, [dispatch, keyword, pageNumber])

    return (
        <div>
            {
                loading && <Spinner />
            }
            <Row>
                <Button variant='secondary' className='btn btn-light' onClick={() => history.goBack()}>Go Back</Button>
            </Row>
            {
                products.length === 0 ?
                    <Alert variant='info'>
                        No Products Found <Button variant='link' onClick={() => history.goBack()}>Go Back</Button>
                    </Alert> :
                    <>
                        <h1 className='text-center mt-1'>Top {match.params.category} Products</h1>
                        <Row className='justify-content-center'>
                            {products && products.slice(0, 4).map((product) => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        {products.length > 4 && <h1 className='text-center mt-5'>Browse More <i className='fa fa-chevron-down'></i> </h1>}
                        {products && products.slice(4).map((product) => (
                            <Table hover responsive className='table-sm'>
                                <ProductRow item={product} history={history} wishlist={false} />
                            </Table>
                        ))}</>}
        </div>
    )
}

export default ListScreen