import React, { useContext,useState,useEffect } from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { TriangleFill } from 'react-bootstrap-icons';
import { ITEM_ROUTE } from '../utils/consts';
import { addToBasket, deleteFromBasket } from '../https/basketAPI';

import CartButton from './CartTrashButton';
const ItemPreview_2 = observer(({ item, isBasket = 0, quantity=0}) => {
  const { basket } = useContext(Context);
  const {user}=useContext(Context)
  const navigate = useNavigate();
  const handleCardClick = (e) => {
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
      return;
    }
    navigate(ITEM_ROUTE + '/' + item.id);
  };
  const addToCart = async () => {
    try {
      const data = await addToBasket(user.user.id, item.id,basket.page,basket.limit);
      if(data)
      {
        basket.setBasketItems(data.rows);
        basket.setTotalCount(data.count);
      }
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error.response?.data || error.message);
    }
  };
  const deleteFromCart = async (toClear=0) => {
    try {
      const data = await deleteFromBasket(user.user.id, item.id, basket.page, basket.limit, toClear); 
      if (data) {
        basket.setBasketItems(data.rows);
        basket.setTotalCount(data.count);
      }
    } catch (error) {
      console.error("Ошибка удаления:", error.response?.data || error.message);
    }
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
            onClick={() => (addToCart())}>
              <TriangleFill size={16} />
            </Button>
            <span className="fw-bold">{quantity}</span>
            <Button variant="light" size="sm" 
            className="p-0 border-0"
            onClick={() => (deleteFromCart())}>
              <TriangleFill size={16} style={{ transform: 'rotate(180deg)' }} />
            </Button>
          </div>
        ) : null}

        <CartButton item={item} isBasket={isBasket} />
      </div>
    </Card>
  );
});

export default ItemPreview_2;
