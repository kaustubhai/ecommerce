import React, { useState ,useRef} from 'react'
import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown,Button} from 'react-bootstrap'
import SearchBox from './SearchBox'
import {Modal} from 'react-responsive-modal'
import { logout } from '../actions/userActions'
const Header = () => {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const [toggle,setToggle] = useState(false)
  const [toggle2,setToggle2] = useState(false)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }
  const [open, setOpen] = React.useState(false);

  const showModal=()=>{
    setOpen(true);
  }
  const closeModal=()=>{
    setOpen(false);
  }

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>KroShop</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            {/* <Route render={({ history }) => <SearchBox history={history} />} /> */}
            <Nav className='container-fluid bg-dark'>
              {/* <NavDropdown title={<i onClick={handleToggle}>Item1<i className= {"fas "+ (toggle ?"fa-angle-up":"fa-angle-down")}></i></i>}>
              <LinkContainer to="/item1">
              <NavDropdown.Item >Option1</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/item2">
              <NavDropdown.Item >Option2</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/item3">
              <NavDropdown.Item >Option3</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            <NavDropdown title={<i onClick={handleToggle2}>Item2<i className= {"fas "+ (toggle2 ?"fa-angle-up":"fa-angle-down") } ></i></i>}>
              <LinkContainer to="/item1">
              <NavDropdown.Item >Option1</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/item2">
              <NavDropdown.Item >Option2</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/item3">
              <NavDropdown.Item >Option3</NavDropdown.Item>
              </LinkContainer>
              </NavDropdown> */}
              <Button className=" bg-dark ml-md-auto" onClick={showModal}>
                <i className="fas fa-search"></i>
                <span className='d-md-none ml-1'>Search</span>
      </Button>
      <Modal
        open={open}
        onClose={closeModal}
        classNames={{
          modal: 'customModal',
        }}
      > 
                <Route render={({ history }) => <SearchBox history={history} closeModal={closeModal} />} />
      </Modal>
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <i className='fas fa-shopping-cart'></i> Cart
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title="User" id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>{userInfo.name.split(' ')[0].slice(0,1).toUpperCase() + userInfo.name.split(' ')[0].slice(1)}</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/wishlist'>
                    <NavDropdown.Item>Wishlist</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fas fa-user'></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/coupons'>
                    <NavDropdown.Item>Coupons</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/newsletter'>
                    <NavDropdown.Item>Newsletter</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
