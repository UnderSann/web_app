import React, { useState, useEffect, useContext,useRef,useParams } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { fetchColors, fetchTypes, createItem, createColor,createType,deleteColor,deleteType,deleteItem,updateItem,fetchOneItem } from '../https/itemAPI'; // тебе нужно реализовать API
import { Plus, Trash } from 'react-bootstrap-icons';
import { useToast, UpWindowMessage } from '../components/UpWindowMessage';
import { ChevronLeft, ChevronRight } from "lucide-react";
import ConfirmModal from './ConfirmModal'

const AddItemAdministrator = observer(({ isEdit = false, onClose }) => {
    const { item,error } = useContext(Context);
    const { toast, showToast } = useToast();
    const fileInputRef = useRef(null);
    
    const isEditMode = Boolean(isEdit);
    const [currentIndex, setCurrentIndex] = useState(0);

    const textAreaRef = useRef(null);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [files, setFiles] = useState([]);
    const [info, setInfo] = useState([]);
    const [colors, setColors] = useState([]);
    const [types, setTypes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [availableTypes, setAvailableTypes] = useState([]);
    const [newColorName, setNewColorName] = useState('');
    const [newColorCode, setNewColorCode] = useState('#000000');
    const [selectedType, setSelectedType] = useState('');
    const [newTypeName, setNewTypeName] = useState('');
    const [newTypeId, setNewTypeId] = useState('');


    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmData, setConfirmData] = useState({
        title: '',
        message: '',
        onConfirm: () => {},
    });

      
    const [isEdited, setIsEdited] = useState(false); // Для отслеживания изменений


    useEffect(() => {
        fetchColors().then(setAvailableColors);
        fetchTypes().then(setAvailableTypes);

        if (isEditMode) {
            const selected = item.items;
            setName(selected.name || '');
            setPrice(selected.price || '');
            setSelectedType(selected.typeId || '');
            setColors(selected.colors?.map(c => c.id) || []);
            
            setInfo(selected.info?.map(i => ({ ...i, number: Date.now() + Math.random() })) || []);
            setFiles(selected.imgs.map(img => ({ img: img.img, id: img.id })) || []);
        }
    }, [isEditMode]);

    const addInfo = () => {
        setInfo([...info, { title: '', discription: '', number: Date.now() }]);
        setIsEdited(true); // Отметим, что есть изменения
    };

    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? { ...i, [key]: value } : i));
        setIsEdited(true); // Отметим, что есть изменения
    };

    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number));
        setIsEdited(true); // Отметим, что есть изменения
    };

    const handleEditChange = () => {
        setIsEdited(true);
    };
    
    
    // Обновлённая функция выбора файлов
    const selectFiles = e => {
        const newFiles = Array.from(e.target.files);
        const validImages = [];
        setIsEdited(true);
        for (const file of newFiles) {
            if (!file.type.startsWith('image/')) {
                showToast(`Файл "${file.name}" не является изображением`,'danger');
                continue;
            }
    
            const isDuplicate = files.some(f => f.name === file.name && f.size === file.size);
            if (isDuplicate) {
                showToast(`Файл "${file.name}" уже добавлен`,'danger');
                continue;
            }
    
            validImages.push(file);
        }
    
        if (validImages.length > 0) {
            setFiles([...files, ...validImages]);
        }
    
        // сбрасываем input чтобы можно было выбрать тот же файл снова
        e.target.value = '';
    };
    
    // Функция для удаления картинки с подтверждением
    const removeFile = (index, isUploaded) => {
        if (isUploaded) {
            // Если это изображение, загруженное с предмета
            setConfirmData({
                title: 'Удаление изображения',
                message: 'Вы уверены, что хотите удалить это изображение?',
                onConfirm: () => {
                    const newFiles = files.filter((_, i) => i !== index);
                    setFiles(newFiles);
                    setIsEdited(true); // Отмечаем, что были изменения
                    setShowConfirm(false);
                }
                
            });
            setShowConfirm(true);
            
        } else {
            // Если это изображение, добавленное через форму
            const newFiles = files.filter((_, i) => i !== index);
            setFiles(newFiles);
            setIsEdited(true); // Отмечаем, что были изменения
        }
        
    };
       
    

    const toggleColor = (id) => {
        setIsEdited(true);
        if (colors.includes(id)) {
            setColors(colors.filter(c => c !== id));
        } else {
            setColors([...colors, id]);
        }
    };
    const handleAddType = () => {
        
        if (newTypeName.trim()) {
            createType(newTypeName)
                .then(newType => {
                    setAvailableTypes([...availableTypes, newType]);
                    setNewTypeName('');
                    setNewTypeId('');
                })
                .catch(err => console.error(err));
        }else{
            showToast("Заполните все поля",'danger')
        }
    };
    
    const handleAddColor = () => {
        if (newColorName.trim() && newColorCode) {
            createColor(newColorName, newColorCode )
                .then(newColor => {
                    setAvailableColors([...availableColors, newColor]);
                    setNewColorName('');
                    setNewColorCode('#000000');
                })
                .catch(err => console.error(err));
        }else{
            showToast("Заполните все поля",'danger')
        }
    };

   // Функция сохранения
   const handleSave = () => {
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', `${price}`);
    files.forEach((file, index) => {
        formData.append('img', file); // всё правильно
    });
    formData.append('oldImg', JSON.stringify(
        files
            .filter(f => !f.name) // Это старые, уже сохранённые
            .map(f => f.img) // Только имя файла
    ));
    
    formData.append('info', JSON.stringify(info));
    formData.append('colorIds', JSON.stringify(colors));
    formData.append('typeId', selectedType);

    const request = isEditMode
        ? updateItem(item.items.id, formData)
        : createItem(formData);

        request
        .then(() => {
            setIsEdited(false);
            showToast(isEditMode ? 'Товар обновлён' : 'Товар добавлен', 'success');
            if (!isEditMode) {
                setName('');
                setPrice('');
                setFiles([]);
                setInfo([]);
                setColors([]);
                setTypes([]);
                setSelectedType('');
                
            }
           // if (onClose) onClose(); // <-- Закрываем окно
        })
    
        .catch(err => showToast(err.response?.data?.message || 'Ошибка при сохранении', 'danger'));
};

    const handleDeleteColor = (id) => {
        const color = availableColors.find(c => c.id === id);
        setConfirmData({
            title: 'Удаление цвета',
            message: `Удалить цвет "${color?.name}"?
            Это может привести к поломке заказов, содержащих этот цвет. Убедитесь, что они отсутствуют или предупредите покупателя.`,
            onConfirm: async () => {
                try { 
                    setShowConfirm(false);
                    await deleteColor(id); 
                    setAvailableColors(prev => prev.filter(c => c.id !== id));
                    setColors(prev => prev.filter(cId => cId !== id));
                    showToast('Цвет успешно удалён', 'success');
                } catch (e) {
                    showToast(e.response?.data?.message || 'Ошибка удаления цвета', 'danger');
                }
            }
        });
        setShowConfirm(true);
    };
    const handleDeleteType = (id) => {
        const type = availableTypes.find(t => t.id === id);
        setConfirmData({
            title: 'Удаление типа',
            message: `Удалить тип "${type?.name}"?
            \nЭто может привести к поломке заказов содержащих этот цвет, убедитесь в том что они отсутвуют или предупредите покупателя.`,
            onConfirm: async() => {
                try{
                    setShowConfirm(false);
                    await deleteType(id)
                    setAvailableTypes(prev => prev.filter(t => t.id !== id));
                    if (selectedType === id) setSelectedType('');
                    showToast('Тип успешно удалён', 'success');
                }catch(e){
                    showToast(e.response?.data?.message || 'Ошибка удаления типа', 'danger');

                }
            }
        });
        setShowConfirm(true);
    };
    
    
    // Подтверждение выхода при изменениях
    const handleExitConfirmation = () => {
        if (isEdited) {
            setConfirmData({
                title: 'Подтверждение выхода',
                message: 'Вы не сохранили изменения. Вы уверены, что хотите выйти?',
                onConfirm: () => {
                    setShowConfirm(false);
                    if (onClose) onClose(); // Закрытие окна
                }
            });
            setShowConfirm(true);
        } else if (onClose) {
            onClose();
        }
    };

    

    return (
        <Container className="d-flex flex-column" style={{ maxWidth: '800px',paddingBottom: '40px' }}>
            
            <h2 className="my-4">{!isEditMode?"Добавить новый товар":"Редактирование товара"}</h2>

            {/* Название */}
            <Form.Group className="mb-3">
                <Form.Label>Название товара</Form.Label>
                <Form.Control 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Введите название"
                />
            </Form.Group>

            {/* Цена */}
            <Form.Group className="mb-3">
                <Form.Label>Цена товара</Form.Label>
                <Form.Control 
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="Введите цену"
                />
            </Form.Group>

{/* Типы товара */}
<Card className="p-3 mb-3">
    <h5>Выбор типа товара</h5>

    {/* Список типов */}
    <Row className="g-2 mb-3">
        {availableTypes.map(type => (
            <Col xs={6} md={4} key={type.id}>
                <div className="d-flex align-items-center justify-content-between">
                    <Form.Check
                        type="radio"
                        name="productType"
                        label={type.name}
                        checked={selectedType === type.id}
                        onChange={() => {setSelectedType(type.id);  setIsEdited(true);}}
                    />
                    <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleDeleteType(type.id)}
                        style={{ padding: '0.25rem 0.4rem' }}
                    >
                        <Trash size={14} />
                    </Button>
                </div>
            </Col>
        ))}
    </Row>


    {/* Добавить новый тип */}
    <div className="mt-3">
        <h6>Добавить новый тип товара</h6>
        <Row className="align-items-center g-2">
            <Col md={6}>
                <Form.Control 
                    placeholder="Название типа" 
                    value={newTypeName}
                    onChange={e => setNewTypeName(e.target.value)}
                />
            </Col>

            <Col xs="auto">
                <Button variant="outline-success" onClick={handleAddType}>
                    <Plus /> Добавить
                </Button>
            </Col>
        </Row>

    </div>
</Card>

            {/* Описания */}
            <Card className="p-3 mb-3">
                <h5>Описание товара</h5>
                <Button variant="outline-primary" className="mb-2" onClick={addInfo}>
                    <Plus /> Добавить описание
                </Button>
                {info.map(i => (
                    <Row key={i.number} className="align-items-center mb-2">
                    <Col md={4}>
                        <Form.Control
                            placeholder="Заголовок"
                            value={i.title}
                            onChange={(e) => changeInfo('title', e.target.value, i.number)}
                        />
                    </Col>
                    <Col md={6}>
                        <Form.Control
                            as="textarea"
                            ref={textAreaRef}
                            rows={1}
                            placeholder="Описание"
                            value={i.discription}
                            style={{ resize: 'none', overflow: 'hidden' }}
                            onChange={(e) => {
                                const textarea = e.target;
                                textarea.style.height = 'auto';
                                textarea.style.height = textarea.scrollHeight + 'px';
                                changeInfo('discription', e.target.value, i.number)
                            }}
                        />
                    </Col>
                    <Col md={2}>
                        <Button variant="outline-danger" onClick={() => removeInfo(i.number)}>
                            <Trash />
                        </Button>
                    </Col>
                </Row>
                
                ))}
            </Card>
            {/* Изображения товара */}
            <Card className="p-3 mb-3">
                <h5>Изображения товара</h5>
                    <Button variant="outline-primary" className="mb-2" onClick={() => fileInputRef.current.click()}>
                        <Plus /> Добавить изображение
                    </Button>
                    <div className="mb-3">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        multiple 
                        onChange={selectFiles} 
                    />
                </div>
            

                {files.length > 0 && (
                    <Row className="g-3">
                        {files.map((file, idx) => (
                            <Col xs={6} md={4} lg={3} key={idx}>
                                <div className="position-relative border rounded p-1">
                                    <img 
                                        src={file instanceof File
                                            ? URL.createObjectURL(file)
                                            : `${process.env.REACT_APP_API_URL}/${file.img}`
                                          }
                                        alt={`Файл ${idx}`} 
                                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} 
                                    />
                                    <div style={{ fontSize: '0.8rem', marginTop: '5px', textAlign: 'center' }}>{file.name}</div>
                                    <Button 
                                        variant="danger" 
                                        size="sm" 
                                        onClick={() => removeFile(idx)}
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            borderRadius: '50%',
                                            padding: '0.25rem 0.4rem',
                                            lineHeight: '1',
                                        }}
                                    >
                                        <Trash size={14} />
                                    </Button>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
                
            </Card>
            {/* Цвета */}
            <Card className="p-3 mb-3">
                <h5>Выбор цветов</h5>
                <Row className="g-2">
                    {availableColors.map(color => (
                        <Col xs={6} md={4} key={color.id}>
                           <div className="d-flex align-items-center justify-content-between">
                            <Form.Check
                                type="checkbox"
                                id={`color-${color.id}`}
                                checked={colors.includes(color.id)}
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
                            <Button 
                                variant="outline-danger" 
                                size="sm" 
                                onClick={() => handleDeleteColor(color.id)}
                                style={{ padding: '0.25rem 0.4rem' }}
                            >
                                <Trash size={14} />
                            </Button>
                        </div>


                        </Col>
                    ))}
                </Row>
                {files.length > 0 && (
                    <div className="mb-3">
                        <h5>Добавленные изображения</h5>
                        <div className="border rounded p-2 text-center" style={{ maxWidth: '400px' }}>
                        <img
                            src={files[currentIndex] instanceof File
                                ? URL.createObjectURL(files[currentIndex])
                                : `${process.env.REACT_APP_API_URL}/${files[currentIndex].img}`
                            }
                            alt={`Изображение ${currentIndex + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                            />

                        <div className="mt-2" style={{ fontSize: '0.9rem' }}>
                            {files[currentIndex].name} ({currentIndex + 1} из {files.length})
                        </div>

                        {/* Кнопки под изображением */}
                        {files.length > 1 && (
                            <div className="d-flex justify-content-between align-items-center mt-2">
                            <Button
                                variant="outline-secondary"
                                disabled={currentIndex === 0}
                                onClick={() => setCurrentIndex((prev) => prev - 1)}
                                style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
                            >
                                <ChevronLeft /> Назад
                            </Button>

                            <Button
                                variant="outline-secondary"
                                disabled={currentIndex === files.length - 1}
                                onClick={() => setCurrentIndex((prev) => prev + 1)}
                                style={{ opacity: currentIndex === files.length - 1 ? 0.5 : 1 }}
                            >
                                Вперёд <ChevronRight />
                            </Button>
                            </div>
                        )}
                        </div>
                    </div>
                    )}
                {/* Добавить новый цвет */}
                <div className="mt-3">
                    <h6>Добавить новый цвет</h6>
                    <Row className="align-items-center g-2">
                        <Col>
                        <Form.Control 
                                placeholder="Название цвета" 
                                value={newColorName}
                                onChange={e => setNewColorName(e.target.value)}
                            />

                        </Col>
                        <Col>
                        <Form.Control 
                            type="color" 
                            value={newColorCode || '#000000'}
                            onChange={e => setNewColorCode(e.target.value)}
                        />

                        </Col>
                        
                        <Col xs="auto">
                            <Button variant="outline-success" onClick={handleAddColor}>
                                <Plus /> Добавить
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Card>

            {/* Кнопка создания */}
            <Button onClick={handleSave} variant="success">
                {isEditMode ? 'Сохранить изменения' : 'Добавить товар'}
            </Button>
            {isEditMode && (
                <Button variant="secondary" className="mt-2" onClick={handleExitConfirmation}>
                    Закрыть
                </Button>
            )}

             <UpWindowMessage toast={toast} />
             <ConfirmModal
                show={showConfirm}
                title={confirmData.title}
                message={confirmData.message}
                onConfirm={confirmData.onConfirm}
                onCancel={() => setShowConfirm(false)}
            />

            
        </Container>
    );
});

export default AddItemAdministrator;
