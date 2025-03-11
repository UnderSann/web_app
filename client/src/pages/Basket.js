import React, { useContext,useState,useEffect } from 'react';

import { Row,Spinner,Container } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { fetchTypes, fetchItems } from '../https/itemAPI';
import Loading from '../components/Loading'
import { fetchBasket } from '../https/basketAPI';
import ItemsList from '../components/ItemsList';
import ItemPreveiw_2 from '../components/ItemPreveiw_2';
const Basket =  observer(() =>{
    const { basket } = useContext(Context);
    const {user}=useContext(Context)
    const userId=user.user.id
    const [loadingItems, setLoadingItems] = useState(true);

    useEffect(() => {
        setLoadingItems(true);
        fetchBasket(userId, basket.page, basket.limit).then(data => {
            basket.setBasketItem(data.rows);
            basket.setTotalCount(data.count);
        }).finally(() => setLoadingItems(false));
    }, [basket.page, basket.selectedType]);
    
    if (loadingItems ) {
        return (<Loading/>);
    }
    return (
        <Container style={{ paddingTop: '80px' }}>
          {basket.basketItems.map((basketItem) => (
            <ItemPreveiw_2 isBasket={true} key={basketItem.id}
                item={basketItem.item}
                quantity={basketItem.quantity}/>
          ))}
        </Container>
    );
});
      

export default Basket;