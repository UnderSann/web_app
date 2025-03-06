import React,{useContext, useEffect} from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { NavLink, useLocation,useNavigate } from 'react-router-dom';
import { registration, login } from '../https/userAPI';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ItemsMain from '../components/ItemsMain';
import ItemsList from '../components/ItemsList';
import { fetchTypes,fetchItems } from '../https/itemAPI';
const Shop = observer(() =>{
    const {item}= useContext(Context);
    const selectedType= item.selectedType
    useEffect(()=>{
        
        fetchTypes().then(data=>item.setTypes(data))
        fetchItems().then(data=>item.setItems(data.rows))
    },[])
    return (
        <Container style={{ paddingTop: '80px' }}>
            {Object.keys(selectedType).length === 0 ? (
                <>
                    {console.log("Выбран пустой тип")}
                    <ItemsMain />
                </>
            ) : (
                <>
                    {console.log(selectedType.name + " выбран")}
                    <ItemsList type={selectedType}/>
                </>
    )}
</Container>

    
    )
});

export default Shop;