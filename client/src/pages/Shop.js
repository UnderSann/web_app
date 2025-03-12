import React, { useContext, useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ItemsMain from '../components/ItemsMain';
import ItemsList from '../components/ItemsList';
import Pages from '../components/Pages';
import { fetchTypes, fetchItems } from '../https/itemAPI';
import Loading from '../components/Loading'
const Shop = observer(() => {
    const { item } = useContext(Context);
    const { user } = useContext(Context);
    const { basket } = useContext(Context);
    let isSelectedType = !(Object.keys(item.selectedType).length === 0);
    const [loadingTypes, setLoadingTypes] = useState(true);
    useEffect(() => {
        setLoadingTypes(true);
        basket.setPage(1)
        fetchTypes()
            .then((typesData) => {
                item.setTypes(typesData);
            })
            .finally(() => setLoadingTypes(false));
    }, []);
    if (loadingTypes ) {
            return (
                <Loading/>
            );
    }
        console.log("ID=",user.user.id,"IsAuth",user.isAuth)
    return (
        <Container style={{ paddingTop: '80px' }}>
            {isSelectedType ? (
                <>
                    <ItemsList type={item.selectedType} />
                    <Pages item={item}/>
                </>
                
            ) : (
                <>
                    <ItemsMain />
                </>
            )}
        </Container>
    );
});

export default Shop;
