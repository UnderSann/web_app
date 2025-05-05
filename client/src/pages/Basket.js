import React, { useContext,useState,useEffect } from 'react';

import { Row,Spinner,Container,Button } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { fetchTypes, fetchItems } from '../https/itemAPI';
import Loading from '../components/Loading'
import { fetchBasket,clearBasket } from '../https/basketAPI';
import ItemsList from '../components/ItemsList';
import ItemPreveiw_2 from '../components/ItemPreveiw_2';
import Pages from '../components/Pages';
import { useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../utils/consts';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useCartActions } from '../scripts/basketScr';
import { useToast, UpWindowMessage } from '../components/UpWindowMessage';

const Basket =  observer(() =>{
    const { basket } = useContext(Context);
    const { paths } = useContext(Context);
    const { toast, showToast } = useToast(); // Хук вызывается здесь
    const { clearCart } = useCartActions(showToast); // Передаем showToast
    const isMobile = window.innerWidth < 768;

    const {user}=useContext(Context)
    const userId=user.user.id
    const [loadingItems, setLoadingItems] = useState(true);
    const navigate=useNavigate()
    useEffect(() => {
        setLoadingItems(true);
        fetchBasket(userId, basket.page, basket.limit).then(data => {
            basket.setBasketItems(data.rows);
            basket.setTotalCount(data.count);
        }).finally(() => setLoadingItems(false));
    }, [basket.page]);
    
    if (loadingItems ) {
        return (<Loading/>);
    }
    const toMain = () => {
        navigate(paths.pop())
        }
;
      
    return (
        <Container style={{ paddingTop: '80px' }}>
            <ArrowLeft 
                className="position-fixed start-0 top-30 translate-middle-y z-3"
                style={{ marginLeft:10, 
                    marginTop:20, 
                        width:30,
                    height:30,
                    // background:'white'
                }} 
                onClick={() => toMain()}
            />
             <Button
                variant="outline-dark"
                style={{
                    width: 90,
                    height: 40,
                    position: 'fixed',
                    right: '10px',
                    textAlign:'center',
                    top: 82,
                    zIndex: 10,
                    background:'white',
                    color: 'black'
                }}
                onClick={() =>clearCart(user,basket) }
            >
            Очистить
            </Button>
            <UpWindowMessage toast={toast} /> 
            <Row
                className="d-flex justify-content-center align-items-center"
                style={{ marginTop: isMobile ? '40px' : '20px' ,
                padding: '0 5px' 
                }}
            >

            {basket.basketItems.length !== 0 ? (
                basket.basketItems.map((basketItem) => (
                    <ItemPreveiw_2 
                        isBasket={true} 
                        key={basketItem.id}
                        Item={basketItem.item}
                        quantity={basketItem.quantity}
                    />
                ))
            ) : (
                <div className="p-3 text-muted" style={{ minWidth: '100%' }}>
                    Корзина пустая
                </div>
            )}
            </Row>
            <Pages item={basket} />
        </Container>
    );
    
});
      

export default Basket;