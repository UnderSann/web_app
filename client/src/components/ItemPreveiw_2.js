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

const ItemPreview_2 = observer(({ Item, isBasket = 0, quantity=0}) => {
    const navigate = useNavigate();

    const { toast, showToast } = useToast(); // Хук вызывается здесь
    const { addToCart,deleteFromCart } = useCartActions(showToast); // Передаем showToast
    const { basket, item } = useContext(Context);
    const { paths } = useContext(Context);
    const {user}=useContext(Context);
    const location = useLocation();
    const handleCardClick = (e) => {
        if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
        return;
        }
        paths.push(location.pathname);
        navigate(ITEM_ROUTE + '/' + Item.id);
    };
  return (
    <Card
      key={Item.id}
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
        src={process.env.REACT_APP_API_URL + Item.imgs[0].img}
        style={{
            width: '190px',
            height: '190px',
            objectFit: 'cover',
            borderRadius: '4px',
            objectPosition: 'center center',
        }}
    />
        
        {/* Блок с названием и описанием */}
        <div className="d-flex flex-column flex-grow-1 ms-3 justify-content-between">
          <div className="text-start ">{Item.name}</div>
          <div className="text-muted">
            {item.types.find(t => t.typeId === Item.typeId)?.name || 'Тип не найден'}
          </div>
        </div>

        <div className="d-flex flex-column justify-content-center text-end ms-auto m-2">
        {/* Цена сверху */}
        <div className="">{Item.price} BYN</div>
        <div className="d-flex align-items-center justify-content-end mt-2 gap-2">
        {/* Блок управления количеством в строку */}
        {isBasket && (
          <>
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
            </>
        )}
         {/* Кнопка удалить (мусорка) */}
         <CartButton item={Item} isBasket={isBasket} addToCart={addToCart} deleteFromCart={deleteFromCart}/>
         </div>
      </div>
      </div>
      <UpWindowMessage toast={toast} />
    </Card>
  );
});

export default ItemPreview_2;