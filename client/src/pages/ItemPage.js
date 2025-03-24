import React, { useContext,useState,useEffect } from 'react';
import { useParams,useNavigate  } from 'react-router-dom';
import { Container,Row,Spinner } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import {fetchOneItem } from '../https/itemAPI';
import Loading from '../components/Loading'
import ImgHorScroll from '../components/ImgHorScroll';
import { BASKET_ROUTE } from '../utils/consts';
import { ArrowLeft } from 'react-bootstrap-icons';
const ItemPage = observer(() => {
   const { item } = useContext(Context);
    const [loadingItem, setLoadingItem] = useState(true);
    const { id } = useParams();
    const navigate =useNavigate()
    useEffect(() => {
        setLoadingItem(true);
        fetchOneItem(id).then(data => {
            item.setItems(data)
        }).finally(() => setLoadingItem(false));
    
    }, []);
        const back = () => {
            item.setSelectedType({})
            navigate(BASKET_ROUTE)
        }
    if (loadingItem ) {
        return (
            <Loading/>
        );
    }
  
    return (
        <Container style={{ paddingTop: '80px' }}>
             <ArrowLeft 
                         className="position-fixed start-0 top-30 translate-middle-y z-3"
                         style={{ marginLeft:10, 
                             marginTop:20, 
                             width:30,
                             height:30,
                             background:'white'
                         }} 
                        onClick={() => back()}
                    />
            <Row>
                <h1>{item.items.name}</h1>
                <ImgHorScroll item={item.items} />
                {item.items.info && item.items.info.map(info => (
    info && (
        <div key={info.id}>
            <div>Параметры: {info.title}</div>
            <div>Описание: {info.discription}</div>
        </div>
    )
))}

                <div>Комментарии: когда-то скоро</div>
            </Row>
        </Container>
    );
})

export default ItemPage;
