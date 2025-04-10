import React, { useContext, useState } from 'react';
import { Context } from '..';
import { Button, Container, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { SHOP_ROUTE, LOGIN_ROUTE, BASKET_ROUTE, ORDER_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';
import { Cart } from 'react-bootstrap-icons';

const NavBar = observer(() => {
    const { user, paths,error } = useContext(Context);
    const { item } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false); 

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.removeItem('token');
        setExpanded(false); 
        error.clearError();
        navigate(process.env.REACT_APP_MAIN_PAGE);
    };

    const toMain = () => {
        item.setSelectedType({});
        setExpanded(false);
        error.clearError();
        navigate(process.env.REACT_APP_MAIN_PAGE);
    };

    const handleNavClick = (path) => {
        paths.push(location.pathname);
        setExpanded(false); 
        error.clearError();
        navigate(path);
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary" fixed="top" expanded={expanded}>
            <Container fluid className="m-2">
                <Navbar.Brand onClick={() => toMain()} style={{ cursor: 'pointer' }}>
                    Craftista
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" onClick={() => setExpanded(!expanded)} />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '250px' }} navbarScroll>
                        {user.isAuth ? (
                            <>
                                <Button className="m-1" variant="outline-dark" as={NavLink} to={ORDER_ROUTE} onClick={() => handleNavClick(ORDER_ROUTE)}>
                                    Заказы
                                </Button>
                                <Button className="m-2" variant="outline-dark" as={NavLink} to={BASKET_ROUTE} onClick={() => handleNavClick(BASKET_ROUTE)}>
                                    <Cart />
                                </Button>
                                <Button className="m-1" variant="outline-dark">Панель администратора</Button>
                                <Button className="m-1" variant="outline-dark" onClick={() => logOut()}>
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline-dark" as={NavLink} to={LOGIN_ROUTE} onClick={() => setExpanded(false)}>
                                Авторизация
                            </Button>
                        )}
                        <Nav.Link className="m-1" href="#action2">Link</Nav.Link>
                        <NavDropdown className="m-1" title="Link" id="navbarScrollingDropdown">
                            <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action5">Something else here</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link className="m-1" href="#" disabled>
                            Link
                        </Nav.Link>
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
});

export default NavBar;
