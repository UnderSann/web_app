import React, { useContext,useState,useEffect } from 'react';

import { Button, Row,Spinner } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { fetchTypes, fetchItems } from '../https/itemAPI';
import ItemsHorScroll from './ItemsHorScroll';
import Loading from './Loading'
import { addToBasket, deleteFromBasket } from '../https/basketAPI';
import { Cart, Trash } from 'react-bootstrap-icons';

const CartButton = ({item, isBasket}) => {
  const { basket } = useContext(Context);
  const {user}=useContext(Context)

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
    <Button
      variant="outline-dark"
      className="m-1"
      style={{ width: 70, height: 50 }}
      onClick={() => (isBasket ? deleteFromCart(1) : addToCart())}
    >
      {isBasket ? <Trash /> : <Cart />}
    </Button>
  )
};

export default CartButton;
