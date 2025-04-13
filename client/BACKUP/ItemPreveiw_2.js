import React, { useContext } from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { TriangleFill } from 'react-bootstrap-icons';
import { ITEM_ROUTE } from '../utils/consts';
import { useCartActions } from '../scripts/basketScr';
import { useToast, UpWindowMessage } from '../components/UpWindowMessage';
import CartButton from './CartTrashButton';

const ItemPreview_2 = observer(({ Item, isBasket = 0, quantity = 0 }) => {
    const navigate = useNavigate();
    const { toast, showToast } = useToast(); // Хук для отображения тостов
    const { addToCart, deleteFromCart } = useCartActions(showToast); // Передаем showToast
    const { basket,item } = useContext(Context);
    const { paths } = useContext(Context);
    const { user } = useContext(Context);
    const location = useLocation();
    // Обработчик клика по карточке
    const handleCardClick = (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        paths.push(location.pathname);
        navigate(ITEM_ROUTE + '/' + Item.id);
    };
   // console.log("TEXT:"+Item.colors.length)
    return (
      <Card
          key={Item.id}
          className="m-2 d-flex flex-row align-items-center"
          style={{
              minWidth: 400,
              maxWidth: 800,
              minHeight: 200,
              cursor: 'pointer',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
          }}
          border="dark"
          onClick={handleCardClick}
      >
          <div className="d-flex flex-row w-100 p-2">
              {/* Картинка слева */}
              <Image
                  src={process.env.REACT_APP_API_URL + Item.imgs[0].img}
                  style={{
                      width: '190px',
                      height: '190px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      objectPosition: 'center center',
                  }}
              />

              {/* Контент карточки */}
              <div className="d-flex flex-column flex-grow-1 ms-3 justify-content-between">
                  {/* Название, тип и описание */}
                  <div>
                      <div className="fw-bold">{Item.name}</div>
                      <div className="text-muted">
                          {item.types.find(t => t.typeId === Item.typeId)?.name || 'Тип не найден'}
                      </div>

                  </div>


              </div>

              {/* Блок справа: управление количеством и корзина */}
{/* Блок справа: количество, стрелки и корзина */}
<div className="d-flex flex-row align-items-center ms-3">
    {isBasket && (
        <>
            {/* Стрелки и количество */}
            <div className="d-flex flex-column align-items-center me-2">
                <Button
                    variant="light"
                    size="sm"
                    className="p-0 border-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(user, Item, basket);
                    }}
                >
                    <TriangleFill size={16} />
                </Button>
                <span className="fw-bold">{quantity}</span>
                <Button
                    variant="light"
                    size="sm"
                    className="p-0 border-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteFromCart(user, Item, basket);
                    }}
                >
                    <TriangleFill size={16} style={{ transform: 'rotate(180deg)' }} />
                </Button>
            </div>

            {/* Кнопка корзины на одном уровне */}
            <CartButton
                item={Item}
                isBasket={isBasket}
                addToCart={addToCart}
                deleteFromCart={deleteFromCart}
            />
        </>
    )}
</div>

          </div>

          {/* Тосты */}
          <UpWindowMessage toast={toast} />
      </Card>

    );
});

export default ItemPreview_2;
 {/*
                    <div
                        className="text-start text-muted"
                        style={{

                            display: '-webkit-box',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitLineClamp: 3, // Ограничение на 3 строки
                            WebkitBoxOrient: 'vertical', // Вертикальное направление
                            lineHeight: '1.5em', // Высота строки
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            fontSize: '12px'
                            
                        }}
                    >
                       {Item?.info[0]?.discription || 'Нет описания'}  
                    </div>
                    */}                  {/* 
                  <div className="d-flex flex-wrap mt-2">
                      {Item.colors.map(color => (
                          color && (
                              <div key={color.id} style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                                  <span
                                      style={{
                                          width: '20px',
                                          height: '20px',
                                          backgroundColor: color.code,
                                          border: '1px solid #000',
                                          borderRadius: '50%',
                                      }}
                                  ></span>
                              </div>
                          )
                      ))}
                  </div>Цвета */}