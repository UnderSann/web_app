import React, { useContext, useState, useEffect } from 'react';
import { Col, Row, Spinner } from "react-bootstrap";
import { Button, Card, Container, Form } from 'react-bootstrap';
import { ITEM_ROUTE } from '../utils/consts';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ItemPreveiw_2 from './ItemPreveiw_2';
import { fetchTypes, fetchItems } from '../https/itemAPI';
import { ArrowLeft } from 'react-bootstrap-icons';
import { SHOP_ROUTE, LOGIN_ROUTE } from '../utils/consts';
import Loading from './Loading';

const ItemsList = observer(({ type }) => {
    const { item } = useContext(Context);
    const isMobile = window.innerWidth < 768;
    const [loadingItems, setLoadingItems] = useState(true);
    const navigate = useNavigate();

    const location = useLocation();

    

    //const page = parseInt(params.get('page')) || 1; // Страница
    //const limit = parseInt(params.get('limit')) || 10; // Лимит

    // Функция для обновления параметров в URL
    const updateUrlParams = (paramsObj) => {
        const query = new URLSearchParams(paramsObj).toString();
        navigate(`?${query}`, { replace: true }); // Обновляем адресную строку
    };
       
 // Эффект для получения и фильтрации товаров при изменении параметров
    useEffect(() => {
  setLoadingItems(true);

  const params = new URLSearchParams(location.search);

const typeIdRaw = params.get('typeId');

    if (!typeIdRaw) {
        //console.log("⏭ Пропускаем запрос, typeId отсутствует в URL");
        return;
    }
const colorsRaw = params.get('colors');

const typeId = typeIdRaw
  ? typeIdRaw
      .split(',')
      .map(Number)
      .filter(n => !isNaN(n) && n !== 0)  // Отфильтровываем 0 и NaN
  : null;

const typeIdWithNulls = typeId.length > 0 ? typeId : null;  // Если массив пуст, записываем null

  const colors = colorsRaw ? colorsRaw
  .split(',')
  .map(Number)
  .filter(n => !isNaN(n)) : null;

  const minPrice = params.get('minPrice');
  const maxPrice = params.get('maxPrice');
  const searchQuery = params.get('search');

const filters = {
  typeId,
  colors,
  minPrice: minPrice ? parseFloat(minPrice) : null,
  maxPrice: maxPrice ? parseFloat(maxPrice) : null,
  query: searchQuery,
  page: item.page,
  limit: item.limit
};


  console.log('FILTERS:', filters); 
fetchItems(filters)
    .then(data => {
      item.setItems(data.rows);
      item.setTotalCount(data.count);
    })
    .finally(() => setLoadingItems(false));
}, [item.page, item.limit, location.search, item.isSearchFilled]);


    // Загрузка данных
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
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 0
                }}
                onClick={() => {
                    // Очистка строки поиска
                    item.setIsSearchFilled(false);  // Убираем флаг поиска
                    item.setSelectedType({});      // Сбрасываем выбранный тип
                    const params = new URLSearchParams(window.location.search);
                    navigate(`${SHOP_ROUTE}`, { replace: true }); // Обновляем URL
                }}
            />

            <div className="center d-flex flex-column w-100" style={{ alignItems: 'center', paddingLeft: isMobile ? '40px' : '0px' }}>
                <h1 className="text-start" style={{ maxWidth: '800px', width: '100%' }}>
                    {!item.isSearchFilled?item.selectedType.name:"Поиск"}
                </h1>
            </div>
            <Row className="d-flex justify-content-center p-1">
                { item.items.length > 0 ? 
                     item.items.map(item => (
                        <ItemPreveiw_2 Item={item} isBasket={false} key={item.id} />
                    ))
                    : (
                        <div className="p-3 text-muted">
                            В настоящее время нет такого товара
                        </div>
                    )}
            </Row>
        </>
    );
});

export default ItemsList;
