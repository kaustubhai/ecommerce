import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import electronics from '../assets/Electronics-banner.jpg'

const Banner = ({ category, active }) => {
    const activeChart = {
        electronics: (<div className='d-flex justify-content-center align-items-center bg-dark banner-height position-relative'>
            <Link className='banner-btn active' to={'/category/electronics'}><Button className='banner-btn' variant='secondary'>Shop Electronics</Button></Link>
            <img src={electronics} alt="" className='w-100 banner-height banner-img position-absolute' />
        </div>),
    }
    const inactiveChart = {
        electronics: (<div className='d-flex justify-content-center align-items-center my-3 bg-dark position-relative banner-height'>
            <Button className='banner-btn' variant='secondary'>Checkout Electronic Products</Button>
            <img src={electronics} alt="" className='w-100 banner-height position-absolute banner-img' />
        </div>),
    }

    if (active && activeChart[category]) {
        return activeChart[category]
    }
    if (inactiveChart[category]) {
        return inactiveChart[category]
    }
    else
        return null;
}

export default Banner