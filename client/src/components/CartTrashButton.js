import React, { useContext,useState,useEffect } from 'react';

import { Button, Row,Spinner } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { fetchTypes, fetchItems } from '../https/itemAPI';
import ItemsHorScroll from './ItemsHorScroll';
import Loading from './Loading'
import { Cart, Trash } from 'react-bootstrap-icons';



const CartButton = ({item, isBasket,deleteFromCart,addToCart}) => {
  const { basket } = useContext(Context);
  const {user}=useContext(Context)
  return (
    <>
    <Button
      variant="outline-dark"
      className="m-1"
      style={{ width: 70, height: 50 }}
      onClick={() => (isBasket ? deleteFromCart(user,item,basket,1) : addToCart(user,item,basket))}
    >
      {isBasket ? <Trash /> : <Cart />}

    </Button>
  
    </>
  )
};

export default CartButton;
