import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Card, Form, Row, Col } from 'react-bootstrap';
import { fetchColors, fetchTypes } from '../https/itemAPI';
import { useNavigate } from 'react-router-dom';
import { Context } from '..';
import { SHOP_ROUTE } from '../utils/consts';

const FilterModal = ({ show, handleClose }) => {
  const { item } = useContext(Context);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const navigate = useNavigate();

useEffect(() => {
  if (show) {
    const params = new URLSearchParams(window.location.search);
    const typesFromParams = params.get('typeId')?.split(',').map(Number).filter(n => !isNaN(n) && n !== 0) || [];
    const colorsFromParams = params.get('colors')?.split(',').map(Number).filter(n => !isNaN(n)) || [];
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

    item.setIsSearchFilled(hasFilters);
  }
}, [show]);


  useEffect(() => {
    fetchColors().then(setAvailableColors);
    fetchTypes().then(setAvailableTypes);
  }, []);

  const applyFilters = () => {
    const params = new URLSearchParams(window.location.search);

    if (selectedTypes.length > 0) {
      params.set('typeId', selectedTypes.join(','));
      item.setIsSearchFilled(true);
    } else {
      params.delete('typeId');
      params.set('typeId', 0); // Или удаляем параметр, если не выбран тип
    }

    if (selectedColors.length > 0) {
      params.set('colors', selectedColors.join(','));
      item.setIsSearchFilled(true);
    } else {
      params.delete('colors');
    }

    if (minPrice) {
      params.set('minPrice', minPrice);
      item.setIsSearchFilled(true);
    } else {
      params.delete('minPrice');
    }

    if (maxPrice) {
      params.set('maxPrice', maxPrice);
      item.setIsSearchFilled(true);
    } else {
      params.delete('maxPrice');
    }
    item.setPage(1)
    navigate(`?${params.toString()}`);
    handleClose();
  };
const clearFilters = () => { 
  setSelectedTypes([]);
  setSelectedColors([]);
  setMinPrice('');
  setMaxPrice('');
    // Очищаем все параметры фильтров

  const params = new URLSearchParams();
  params.delete('typeId');
  params.delete('colors');
  params.delete('minPrice');
  params.delete('maxPrice');
  // Устанавливаем параметр typeId как 0, если selectedType не задан
  if (!item.selectedType && !item.isSearchFilled) {
    item.setSelectedType({ name: "Все товары", id: null }); // Устанавливаем selectedType как 0
    params.set('typeId', 0); // Добавляем typeId=0 в строку поиска
    item.setIsSearchFilled(false);

  }

  // Добавляем другие параметры, если они есть
  if (item.selectedType !== 0) {
    item.setSelectedType({ name: "Все товары", id: null })
    params.set('typeId', 0); // Пример для других значений
    item.setIsSearchFilled(false);

  }

  // Навигация с обновленными параметрами
  navigate(`${SHOP_ROUTE}?${params.toString()}`, { replace: true });

  item.setIsSearchFilled(false);
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
