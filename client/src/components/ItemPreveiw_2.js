import React, { useContext } from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ITEM_ROUTE } from '../utils/consts';
import { Cart, Trash } from 'react-bootstrap-icons';
import { Context } from '..';
import { addToBasket } from '../https/basketAPI'; // Импорт функции запроса

const ItemPreview_2 = observer(({ item, isBasket,quantity  }) => {
const { basket } = useContext(Context);
const { user } = useContext(Context);
  // Делаем addToCart асинхронным
  const addToCart = async () => {
    try {
      console.log("Отправка в корзину:", { userId: user.user.id, itemId: item.id });
      const data = await addToBasket(user.user.id,item.id); // Отправляем на сервер
      if(data)
      {
        basket.addBasketItem(data); // Обновляем MobX store
      }
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error.response?.data || error.message);
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
      as={NavLink} to={ITEM_ROUTE + "/" + item.id}
      border="dark"
    >
      <div className="d-flex flex-row align-items-start w-100">
        {/* Картинка слева */}
        <Image
          className="me-3"
          width={190}
          height={190}
          src={process.env.REACT_APP_API_URL + item.img}
          style={{ objectFit: 'cover' }}
        />
        {/* Блок с названием и описанием */}
        <div className="d-flex flex-column flex-grow-1">
          <div className="text-start">{item.name}</div>
          <div className="text-start text-muted">{item.description}</div>
        </div>
        {/* Цена справа */}
        <div className="d-flex flex-column justify-content-center text-end ms-auto m-2">
          <div>{item.price} BYN</div>
          <Button
            variant="outline-dark"
            className="m-1"
            style={{ width: 70, height: 50 }}
            onClick={() => addToCart()} // Добавляем обработчик
          >
            {isBasket ? <Trash/> : <Cart />}
          </Button>
          <>{quantity}</>
        </div>
      </div>
    </Card>
  );
});

export default ItemPreview_2;
