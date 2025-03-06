import React, { useContext, useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from '../utils/consts';
import { NavLink, useLocation,useNavigate } from 'react-router-dom';
import { registration, login } from '../https/userAPI';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

const Auth = observer(() => {
    const location = useLocation();
    const navigate = useNavigate();

    const isLogin = location.pathname === LOGIN_ROUTE;
    
    const { user } = useContext(Context);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rep_password, setRepPassword] = useState('');
    const [error, setError] = useState(''); 

    const click = async () => {
        if (!isLogin && password !== rep_password) {
            setError('Пароли не совпадают');
            return;
        } else {
            setError('');
            
        }

        try {
            let userData;
            if (isLogin) {
                userData = await login(email, password);
            } else {
                userData = await registration(email, password);
            }
            user.setUser(userData);
            user.setIsAuth(true);
            navigate(SHOP_ROUTE)
        } catch (e) {
            setError(e.response.data.message);
        }
    };

    return (
        <Container 
            className='d-flex justify-content-center align-items-center'
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                <Form className='d-flex flex-column'>
                    <Form.Control
                        className="mt-2"
                        placeholder="Введите ваш email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-2"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    {!isLogin && (
                        <>
                            <Form.Control
                                className="mt-2"
                                placeholder="Повторите пароль"
                                value={rep_password}
                                onChange={e => setRepPassword(e.target.value)}
                                type="password"
                            />
                        </>
                    )}
                    {error && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{error}</div>}
                    <Button
                        variant="outline-dark"
                        className="mt-2"
                        onClick={click}
                    >
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                    <Button as={NavLink} to={isLogin ? REGISTRATION_ROUTE : LOGIN_ROUTE}
                        variant="outline-dark"
                        className="mt-2"
                    >
                        {isLogin ? 'Зарегистрироваться' : 'Войти'}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;
