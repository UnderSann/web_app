import React, { useContext, useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ItemsMain from '../components/ItemsMain';
import ItemsList from '../components/ItemsList';
import Pages from '../components/Pages';
import { fetchTypes, fetchItems } from '../https/itemAPI';

const Shop = observer(() => {
    const { item } = useContext(Context);
    let isSelectedType = !(Object.keys(item.selectedType).length === 0);
    const [loadingTypes, setLoadingTypes] = useState(true);
    useEffect(() => {
        setLoadingTypes(true);
        fetchTypes()
            .then((typesData) => {
                item.setTypes(typesData);
            })
            .finally(() => setLoadingTypes(false));
    }, []);
    if (loadingTypes ) {
            return (
                <div 
                    className="d-flex justify-content-center align-items-center" 
                    style={{ height: '100vh' }}
                >
                    <Spinner animation="grow" style={{ transform: 'scale(2)' }} />
                </div>
            );
    }

    return (
        <Container style={{ paddingTop: '80px' }}>
            {isSelectedType ? (
                <>
                    <ItemsList type={item.selectedType} />
                    <Pages />
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
