import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Button, Modal, Form, Image, ListGroup } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { fetchOneItem, deleteItem } from '../https/itemAPI';
import Loading from '../components/Loading';
import ImgHorScroll from '../components/ImgHorScroll';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useCartActions } from '../scripts/basketScr';
import { useToast, UpWindowMessage } from '../components/UpWindowMessage';
import OrderModal from '../components/OrderModal';
import { fetchOneBasket } from '../https/basketAPI';
import AddItemAdministrator from '../components/AddItemAdministrator';

import { Cart ,Trash,Pencil } from 'react-bootstrap-icons';
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';

const ItemPage = observer(() => {
    const [editMode, setEditMode] = useState(false);


    const { toast, showToast } = useToast(); // Хук вызывается здесь
    const { addToCart } = useCartActions(showToast); // Передаем showToast
    const { item, basket, user, paths, order,error } = useContext(Context);
    const [loadingItem, setLoadingItem] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const isMobile = window.innerWidth < 768;
    const navigate = useNavigate();
    const { id } = useParams();


    useEffect(() => {
        setLoadingItem(true);
        fetchOneItem(id)
            .then(data => {
                item.setItems(data);
            })
            .catch(err => {
                console.error("Ошибка загрузки товара:", err);
            })
            .finally(() => setLoadingItem(false)); // Убедитесь, что состояние обновляется корректно
    }, [id,editMode]);
    
    const [loadingBasket, setLoadingBasket] = useState(false);

    useEffect(() => {
        if (user.isAuth && user.user?.id && item.items?.id) {
            setLoadingBasket(true);
            fetchOneBasket(user.user.id, item.items.id)
                .then(basketData => {
                    basket.setBasketItems([basketData]);
                    basket.setTotalCount(1);
                })
                .catch(err => console.error("Ошибка при загрузке корзины:", err))
                .finally(() => setLoadingBasket(false));
        } else {
            basket.setBasketItems({});
            basket.setTotalCount(0);
        }
    }, [user.isAuth, user.user?.id, item.items?.id]);
 
    const back = () => {
        navigate(paths.pop());
    };
    const handleDelete = async () => {
        try {
            const data = await deleteItem(item.items.id); // Удаляем товар
            showToast(data.message, 'success'); // Показываем успешное сообщение
            navigate(paths.pop());
        } catch (error) {
            showToast("Ошибка при удалении товара", 'text-danger'); // Если ошибка
        }
    };
    if (loadingItem || loadingBasket) {
        return <Loading />;
    }
    
    if (editMode) {
        return (
            <Container style={{ paddingTop: '70px'}}>
                <AddItemAdministrator isEdit={true} onClose={() => setEditMode(false)} />        
            </Container>
        );

    }
    
    const showModalHandler =()=>{
        if(user.isAuth && Array.isArray(item.items?.colors) && item.items.colors.length > 0)
        {
            setShowModal(true)
        }else{
            showToast("Извините, в данный момент товар недоступен для заказа",'danger')
        }
    }
    // Переход к рендерингу данных после их загрузки
    return (
        <Container style={{ paddingTop: '70px',paddingBottom: '30px' }}>
            
            <ArrowLeft 
                className="position-fixed start-0  translate-middle-y z-3"
                style={{ marginLeft: 10, marginTop: 20, width: 30, height: 30}} 
                onClick={back}
            />
            {!error.errorCode && !error.errorMessage  &&
            <Row>
                {/* Название товара и цена */}
                <h1
                    className="mb-0 text-start"
                    style={{ marginLeft: isMobile ? '30px' : '0px' }}
                >
                    {item.items?.name + " - " + item.items?.price} BYN
                </h1>
                <ImgHorScroll item={item.items}/>
                {/* Кнопки заказа, добавления в карзину и удаления */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'stretch',
                        marginTop: '10px',
                        padding: '0 10px', // чтобы не прилипали к краям
                    }}
                >
                    <Button
                        variant="outline-dark"
                        className="w-100"
                        onClick={() => { user.isAuth ? showModalHandler() : showToast("Вы не авторизованы", 'text-danger') }}
                    >
                        Заказать
                    </Button>
                    <Button
                        variant="outline-dark"
                        className="w-100"
                        onClick={() => addToCart(user, item.items, basket)}
                    >
                        <Cart />
                    </Button>
                    {user.user.role === 'ADMIN' && (
                        <>
                            <Button
                                variant="outline-dark"
                                className="w-100"
                                onClick={() => setEditMode(true)}
                            >
                                <Pencil />
                            </Button>
                            <Button
                                variant="outline-dark"
                                className="w-100"
                                onClick={handleDelete}
                            >
                                <Trash />
                            </Button>
                        </>
                    )}

                </div>


                <UpWindowMessage toast={toast} />

                {/* Модальное окно заказа */}
                {user.isAuth && 
                <OrderModal 
                    show={showModal} 
                    onHide={() => setShowModal(false)} 
                />
                
                }
                {/* Характеристики товара */}
                {(Array.isArray(item.items?.colors) && item.items.colors.length > 0) && (
                    <div className="mt-4">
                        <h3>Цвета</h3>
                        <ListGroup>
                            <ListGroup.Item>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}>
                                    {item.items.colors.map(color => (
                                        color && (
                                            <div key={color.id} style={{ display: 'flex', alignItems: 'center' }}>
                                                 <span
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        backgroundColor: color.code,
                                                        margin: '0 5px',
                                                        border: '1px solid #000',
                                                    }}
                                                ></span>
                                                <span> - {color.name}<strong>;</strong></span>
                                               
                                            </div>
                                        )
                                    ))}
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                )}

                {(Array.isArray(item.items?.info) && item.items.info.length > 0) && (
                    <div className="mt-4">
                        <h3>Характеристики</h3>
                        <ListGroup>
                            {item.items.info.map(info => (
                                info && (
                                    <ListGroup.Item key={info.id}>
                                        <strong>{info.title}:</strong> {info.discription}
                                    </ListGroup.Item>
                                )
                            ))}
                        </ListGroup>
                    </div>
                )}


                {/* Комментарии 
                <div className="mt-4">
                    <h4>Комментарии</h4>
                    <ListGroup>
                        <ListGroup.Item>
                            В процессе
                        </ListGroup.Item>
                    </ListGroup>
                </div>*/}
            </Row>
            }
        </Container>
    );
});

export default ItemPage;
