import React, { useContext, useState, useEffect } from 'react';
import { Row } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ItemPreveiw_2 from './ItemPreveiw_2';
import { fetchItems } from '../https/itemAPI';
import { ArrowLeft } from 'react-bootstrap-icons';
import Loading from './Loading';
import { SHOP_ROUTE } from '../utils/consts';

const ItemsList = observer(() => {
    const { item, paths } = useContext(Context);
    const isMobile = window.innerWidth < 768;
    const [loadingItems, setLoadingItems] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

useEffect(() => {
    setLoadingItems(true);

    const params = new URLSearchParams(location.search);
    const typeIdRaw = params.get('typeId');
    const colorsRaw = params.get('colors');
    const minPriceRaw = params.get('minPrice');
    const maxPriceRaw = params.get('maxPrice');
    const searchQuery = params.get('search') || null;

    const typeId = typeIdRaw
        ? typeIdRaw.split(',').map(n => parseInt(n)).filter(n => !isNaN(n) && n !== 0)
        : null;

    const colors = colorsRaw
        ? colorsRaw.split(',').map(n => parseInt(n)).filter(n => !isNaN(n))
        : null;

    const minPrice = minPriceRaw ? parseFloat(minPriceRaw) : null;
    const maxPrice = maxPriceRaw ? parseFloat(maxPriceRaw) : null;

    const filters = {
        typeId,
        colors,
        minPrice,
        maxPrice,
        query: searchQuery,
        page: item.page,
        limit: 5,
    };

    fetchItems(filters)
        .then(data => {
            if (!data || !data.rows) {
                console.warn('Пустой или некорректный ответ от сервера', data);
                item.setItems([]);
                item.setTotalCount(0);
                return;
            }
            item.setItems(data.rows);
            item.setTotalCount(data.count);
        })
        .catch(err => {
            console.error('Ошибка загрузки товаров:', err);
        })
        .finally(() => setLoadingItems(false));
}, [location.search, item.page,item.isFiltersFilled,item.isSearchFilled]);

    if (loadingItems) {
        return <Loading />;
    }

    return (
        <>
            <ArrowLeft
                className="position-fixed start-0 translate-middle-y z-3"
                style={{
                    marginLeft: 0,
                    top: 95,
                    width: 50,
                    height: 30,
                    backgroundColor: "white",
                    border: "2px solid black",
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                }}
                onClick={() => {
                    item.setIsSearchFilled(false);
                    item.setSelectedType({});
                    item.setIsFiltersFilled(false);
                    const prevPath = paths.pop() || '/';
                    if(prevPath!== '/'){
                       navigate(prevPath, { replace: true }); 
                    }else{
                        navigate(SHOP_ROUTE, { replace: true });
                    }
                }}
            />
            <div
                className="center d-flex flex-column w-100"
                style={{ alignItems: 'center', paddingLeft: isMobile ? '40px' : '0px' }}
            >
                <h1 className="text-start" style={{ maxWidth: 800, width: '100%' }}>
                    {!item.isSearchFilled || !item.isFiltersFilled
                        ? item.selectedType?.name ||'Поиск'
                        : 'Поиск'}
                </h1>
            </div>
            <Row className="d-flex justify-content-center p-1">
                {item.items.length > 0
                    ? item.items.map(i => (
                        <ItemPreveiw_2 Item={i} isBasket={false} key={i.id} />
                      ))
                    : <div className="p-3 text-muted">В настоящее время нет такого товара</div>
                }
            </Row>
        </>
    );
});

export default ItemsList;
