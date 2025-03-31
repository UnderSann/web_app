import React, { useContext } from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { useNavigate,useLocation } from 'react-router-dom';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { TriangleFill } from 'react-bootstrap-icons';
import { BASKET_ROUTE, ITEM_ROUTE, SHOP_ROUTE } from '../utils/consts';
import { useCartActions } from '../scripts/basketScr';
import { useToast, UpWindowMessage } from '../components/UpWindowMessage';
import CartButton from './CartTrashButton';

const ItemPreview_2 = observer(({ item, isBasket = 0, quantity=0}) => {
    const navigate = useNavigate();

    const { toast, showToast } = useToast(); // Хук вызывается здесь
    const { addToCart,deleteFromCart } = useCartActions(showToast); // Передаем showToast
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
      className="m-2 d-flex flex-row align-items-center"
      style={{
        minWidth: 400,
        maxWidth: 800,
        minHeight: 200,
        cursor: "pointer",
        whiteSpace: "normal",
        wordWrap: "break-word",
      }}
      border="dark"
      onClick={handleCardClick}
    >
      <div className="d-flex flex-row align-items-start w-100">
        {/* Картинка слева */}
        <Image
          className="me-3"
          width={190}
          height={190}
          src={process.env.REACT_APP_API_URL + item.imgs[0].img}
          style={{ objectFit: 'cover' }}
        />
        
        {/* Блок с названием и описанием */}
        <div className="d-flex flex-column flex-grow-1">
          <div className="text-start">{item.name}</div>
          <div className="text-start text-muted">{item.description}</div>
        </div>

        {/* Цена и количество справа */}
        <div className="d-flex flex-column justify-content-center text-end ms-auto m-2">
          <div>{item.price} BYN</div>
        </div>

        {isBasket ? (
          <div className="d-flex flex-column align-items-center me-2">
            <Button variant="light" size="sm" 
            className="p-0 border-0"
            onClick={() => (addToCart(user,item,basket))}>
              <TriangleFill size={16} />
            </Button>

            <span className="fw-bold">{quantity}</span>
            <Button variant="light" size="sm" 
            className="p-0 border-0"
            onClick={() => (deleteFromCart(user,item,basket))}>
              <TriangleFill size={16} style={{ transform: 'rotate(180deg)' }} />
            </Button>       
            </div>
        ) : null}
            
        <CartButton item={item} isBasket={isBasket} addToCart={addToCart} deleteFromCart={deleteFromCart}/>
        <UpWindowMessage toast={toast} />
      </div>
    </Card>
  );
});

export default ItemPreview_2;
