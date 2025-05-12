import React, { useContext, useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ItemsMain from '../components/ItemsMain';
import ItemsList from '../components/ItemsList';
import Pages from '../components/Pages';
import { fetchTypes, fetchItems } from '../https/itemAPI';
import Loading from '../components/Loading'
import { useLocation } from 'react-router-dom';
const Shop = observer(() => {
    const { item } = useContext(Context);
    const { user } = useContext(Context);
    const { basket } = useContext(Context);
        const location = useLocation();

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
    const params = new URLSearchParams(location.search);
    const hasSearchParams = (
    params.has('typeId') || // всегда учитываем наличие typeId
    params.has('colors') ||
    params.has('minPrice') ||
    params.has('maxPrice') ||
    params.has('search')
    );

    console.log("SelType=", item.selectedType.id, "\n Search", item.isSearchFilled);

    return (
    <Container style={{ paddingTop: '80px' }}>
       {hasSearchParams||isSelectedType||item.isSearchFilled ? (
            <>
            <ItemsList type={item.selectedType} />
            <Pages item={item}/>
            </>
        ) : (
            <ItemsMain />
        )
        }
    </Container>
    );
});

export default Shop;
