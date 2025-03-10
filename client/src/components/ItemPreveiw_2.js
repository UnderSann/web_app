import React from 'react';
import { Card, Image} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ITEM_ROUTE } from '../utils/consts';
import { Cart } from 'react-bootstrap-icons';
const ItemPreview_2 = observer(({ item }) => {
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
        wordWrap: "break-word"
      }}
      as={NavLink} to={ITEM_ROUTE+"/"+item.id}
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
        </div>
      </div>
    </Card>
  );
});

export default ItemPreview_2;
