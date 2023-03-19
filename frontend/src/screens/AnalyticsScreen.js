import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getLowInStockProducts, getNetSaleThisFY, getNetSaleThisMonth, getNewUserOnboardedThisMonth, getOutOfStockProducts, getProcessingOrderCount } from '../actions/analyticsActions';
import { Link } from 'react-router-dom'

const AnalyticsScreen = () => {
  const dispatch = useDispatch();
  const analytics = useSelector(state => state.analytics)

    useEffect(() => {
        dispatch(getNetSaleThisFY())
        dispatch(getNetSaleThisMonth()) 
        dispatch(getOutOfStockProducts())
        dispatch(getLowInStockProducts())
        dispatch(getNewUserOnboardedThisMonth())
        dispatch(getProcessingOrderCount())
    }, [dispatch])

  return (
    <div className='container'>
      <div className="row mt-3">
        <div className="col-md-6 px-2">
          <h4>Net Sale This FY</h4>
          <h1>{analytics.netSaleFY?.toLocaleString('en-IN')}</h1>
        </div>
        <div className="col-md-6 px-2">
          <h4>Net Sale This Month</h4>
          <h1>{analytics.netSaleMO?.toLocaleString('en-IN')}</h1>
        </div>
        </div>
      <div className="row mt-3">
        <div className="col-md-6 px-2">
          <h4>User registered This Month</h4>
          <h1>{analytics.usersRegistered?.toLocaleString('en-IN')}</h1>
        </div>
        <div className="col-md-6 px-2">
          <h4>Processing Orders</h4>
          <h1>{analytics.processingOrders?.toLocaleString('en-IN')}</h1>
        </div>
      </div>
      {analytics.outOfStockProducts.length > 0 && <div className="row mt-5">
        <h4>Out of Stocks products</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Category</th>
              <th scope="col">Brand</th>
              <th scope="col">Edit</th>
            </tr>
          </thead>
          <tbody>
            {analytics.outOfStockProducts.map(product => (
              <tr key={product._id}>
                <td><Link to={`/product/${product._id}`}>
                      {product.name}
                  </Link></td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td><Link to={`/admin/product/${product._id}/edit`}>
                      Edit
                  </Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>}
      {analytics.lowInStockProducts.length > 0 && <div className="row mt-5">
        <h4>Out of Stocks products</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Category</th>
              <th scope="col">Brand</th>
              <th scope="col">Edit</th>
            </tr>
          </thead>
          <tbody>
            {analytics.lowInStockProducts.map(product => (
              <tr key={product._id}>
                <td><Link to={`/product/${product._id}`}>
                      {product.name}
                  </Link></td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td><Link to={`/admin/product/${product._id}/edit`}>
                      Edit
                  </Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>}
    </div>
  )
}

export default AnalyticsScreen