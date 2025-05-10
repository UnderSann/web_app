import React, { useContext,useState,useEffect } from 'react';
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

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
    <Card
      key={Item.id}
      className="m-2 d-flex flex-column flex-md-row align-items-center"
      style={{
        width: '100%',
        maxWidth: 800,
        minHeight: 200,
        cursor: "pointer",
        whiteSpace: "normal",
        wordWrap: "break-word",
      }}
      border="dark"
      onClick={handleCardClick}
    >
    <div className="d-flex flex-md-row align-items-start w-100 pt-1 pb-1 pl-1">
    {/* Картинка слева */}
       <Image
        src={process.env.REACT_APP_API_URL + Item.imgs[Item.imgs.length-1].img}
        style={{
            width: '190px',
            height: '190px',
            objectFit: 'cover',
            borderRadius: '4px',
            objectPosition: 'center center',
        }}
    />
        <div className={`d-flex ${isMobile ? 'flex-column' : 'flex-row'} align-items-start w-100 pt-1 pb-1 pl-1`}>

        {/* Блок с названием и описанием */}
        <div className="d-flex flex-column flex-grow-1 ms-3 justify-content-between">
          <div className="text-start ">{Item.name}</div>
          <div className="text-muted">
            {item.types.find(t => t.id === Item.typeId)?.name || 'Тип не найден'}
          </div>
        </div>

        <div
        className={`d-flex flex-column justify-content-center text-end ${isMobile ? '' : 'm-2'} ${isMobile ? '' : 'ms-auto'}`}
        style={{
          width: isMobile ? '100%' : 'auto',
          marginTop: isMobile ? '1rem' : '0',
        }}
      >

        {/* Цена сверху */}
        <div className="">{Item.price} BYN</div>
        <div className="d-flex align-items-center justify-content-end mt-2 gap-2">
        {/* Блок управления количеством в строку */}
        {isBasket && (
          <>
          <div className="d-flex flex-column align-items-center me-2">
            <Button variant="light" size="sm" 
            className="p-0 border-0"
            onClick={() => (addToCart(user,Item,basket))}>
              <TriangleFill size={16} />
            </Button>

            <span className="fw-bold">{quantity}</span>
            <Button variant="light" size="sm" 
            className="p-0 border-0"
            onClick={() => (deleteFromCart(user,Item,basket))}>
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
      </div>
      <UpWindowMessage toast={toast} />
    </Card>
  );
});

export default ItemPreview_2;