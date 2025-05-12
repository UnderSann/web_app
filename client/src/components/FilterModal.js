import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Card, Form, Row, Col } from 'react-bootstrap';
import { fetchColors, fetchTypes } from '../https/itemAPI';
import { useNavigate } from 'react-router-dom';
import { Context } from '..';

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
    fetchColors().then(setAvailableColors);
    fetchTypes().then(setAvailableTypes);
  }, []);

  // Если isSearchFilled == false, сбрасываем все фильтры
  useEffect(() => {
    if (!item.isSearchFilled) {
      clearFilters();  // Очистим фильтры, если isSearchFilled == false
    }
  }, [item.isSearchFilled]);

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

    navigate(`?${params.toString()}`);
    handleClose();
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedColors([]);
    setMinPrice('');
    setMaxPrice('');
    item.setIsSearchFilled(false); // Зануляем состояние isSearchFilled
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
