import React, { useContext} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import { Button,Card,Image } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { ITEM_ROUTE, SHOP_ROUTE } from '../utils/consts';
import { Cart } from 'react-bootstrap-icons';

import { useCartActions } from '../scripts/basketScr';
import { useToast, UpWindowMessage } from '../components/UpWindowMessage';

const ItemPreveiw = observer(({ item }) => {
    const navigate = useNavigate();
    const { toast, showToast } = useToast(); // Хук вызывается здесь
    const { addToCart } = useCartActions(showToast); // Передаем showToast

    const { basket } = useContext(Context);
    const { paths } = useContext(Context);
    const {user}=useContext(Context);
    const location = useLocation();
    const handleCardClick = (e) => {
        if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
        return;
        }
        paths.push(location.pathname);
        navigate(ITEM_ROUTE + '/' + item.id);
    };
    return (
        
        <Card 
            key={item.id} 
            className="m-2" 
            style={{ 
                minWidth: 250, 
                minHeight: 350, 
                cursor: "pointer",
                whiteSpace: "normal",
                wordWrap: "break-word"
            }}
            onClick={handleCardClick}
            border='dark'
        >
            {/* Изображение по центру */}
            <Image 
                className="p-1 mx-auto d-block" 
                width={245} height={290} 
                style={{ objectFit: 'cover',
                    borderRadius: '4px',
                    objectPosition: 'center center',}}
                src={process.env.REACT_APP_API_URL + item.imgs[0].img} 
            />

            {/* Контейнер для name и price */}
            <div className="d-flex justify-content-between align-items-center" 
            style={{ minHeight: 60 }}>
                <div className="m-2 text-start">
                    {item.name}    
                </div>
                <div className="m-2 text-end">
                    {item.price+" BYN"} 
                </div>
            </div>
            <Button variant="outline-dark" className="m-2"
            onClick={() => (addToCart(user,item,basket))}>
                <Cart/>
            </Button>
            <UpWindowMessage toast={toast} />
        </Card>    
    );
});



export default ItemPreveiw;
