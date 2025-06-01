import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Card, Form, Row, Col } from 'react-bootstrap';
import { fetchColors, fetchTypes } from '../https/itemAPI';
import { useNavigate,useLocation } from 'react-router-dom';
import { Context } from '..';
import { SHOP_ROUTE } from '../utils/consts';

const FilterModal = ({ show, handleClose }) => {
  const { item, paths } = useContext(Context);

  const [availableColors, setAvailableColors] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const navigate = useNavigate();
  const location=useLocation()
  const updateSearchParams = (updates = {}) => {
  const params = new URLSearchParams(window.location.search);
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else {
      params.set(key, Array.isArray(value) ? value.join(',') : value);
    }
  });
  return params;
};
useEffect(() => {
  if (show) {
    const params = new URLSearchParams(window.location.search);
    const typesFromParams = params.get('typeId')?.split(',')
      .map(Number)
      .filter(n => !isNaN(n) && n !== 0) || [];
    const colorsFromParams = params.get('colors')?.split(',')
      .map(Number)
      .filter(n => !isNaN(n)) || [];
    const min = params.get('minPrice') || '';
    const max = params.get('maxPrice') || '';

    setSelectedTypes(typesFromParams);
    setSelectedColors(colorsFromParams);
    setMinPrice(min);
    setMaxPrice(max);

    const hasFilters = (
      typesFromParams.length > 0 ||
      colorsFromParams.length > 0 ||
      min !== '' ||
      max !== ''
    );

    // ❗ Применяем только если действительно есть фильтры
    item.setIsFiltersFilled(hasFilters);
  }
}, [show]);




  useEffect(() => {
    fetchColors().then(setAvailableColors);
    fetchTypes().then(setAvailableTypes);
  }, []);

// В applyFilters:
const applyFilters = () => {

  const updated = updateSearchParams({
    typeId: selectedTypes.length > 0 ? selectedTypes : null,  // убираем 0, ставим null
    colors: selectedColors.length > 0 ? selectedColors : null,
    minPrice: minPrice !== '' ? minPrice : null,
    maxPrice: maxPrice !== '' ? maxPrice : null
  });

  if (!item.isSearchFilled  && location.pathname !== SHOP_ROUTE) {
    paths.push(location.pathname + location.search);
  }

  // определяем, заполнены ли фильтры
  const hasFilters = (
    selectedTypes.length > 0 ||
    selectedColors.length > 0 ||
    minPrice !== '' ||
    maxPrice !== ''
  );


  item.setIsFiltersFilled(hasFilters);
  if(hasFilters){ 
     item.setSelectedType(/*{ name: "Все товары", id: null }*/{ name: undefined, id: undefined });
}
  item.setPage(1);
  navigate(`${SHOP_ROUTE}?${updated.toString()}`);
  handleClose();
};



const clearFilters = () => {
  const hasFilters =
    selectedTypes.length > 0 ||
    selectedColors.length > 0 ||
    minPrice !== '' ||
    maxPrice !== '';

  const updated = updateSearchParams({
    typeId: 0,
    colors: null,
    minPrice: null,
    maxPrice: null
  });

  if (hasFilters) {
    item.setSelectedType({ name: undefined, id: undefined });
  }

  item.setIsFiltersFilled(false);
  item.setPage(1);

  const prevPath = paths.pop();
  if (prevPath && !item.isSearchFilled) {
    navigate(prevPath);
  } else {
    navigate(`${SHOP_ROUTE}?${updated.toString()}`);
  }

  handleClose();
};



  const toggleType = (id) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleColor = (id) => {
    setSelectedColors(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Фильтры</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="p-3 mb-3">
          <h5>Выбор типа товара</h5>
          <Row className="g-2 mb-3">
            {availableTypes.map(type => (
              <Col xs={6} md={4} key={type.id}>
                <Form.Check
                  type="checkbox"
                  label={type.name}
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => toggleType(type.id)}
                />
              </Col>
            ))}
          </Row>
        </Card>

        <Card className="p-3 mb-3">
          <h5>Выбор цветов</h5>
          <Row className="g-2">
            {availableColors.map(color => (
              <Col xs={6} md={4} key={color.id}>
                <Form.Check
                  type="checkbox"
                  id={`color-${color.id}`}
                  checked={selectedColors.includes(color.id)}
                  onChange={() => toggleColor(color.id)}
                  label={
                    <span>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '1em',
                          height: '1em',
                          borderRadius: '50%',
                          backgroundColor: color.code,
                          marginRight: '8px',
                          border: '1px solid #ccc'
                        }}
                      />
                      {color.name}
                    </span>
                  }
                />
              </Col>
            ))}
          </Row>
        </Card>

        <Card className="p-3 mb-3">
          <h5>Цена</h5>
          <Row>
            <Col>
              <Form.Control
                type="number"
                placeholder="Мин"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Макс"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
              />
            </Col>
          </Row>
        </Card>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="outline-danger" onClick={clearFilters}>
          Очистить фильтры
        </Button>
        <div>
          <Button variant="secondary" onClick={handleClose} className="me-2">
            Отмена
          </Button>
          <Button variant="dark" onClick={applyFilters}>
            Применить
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
