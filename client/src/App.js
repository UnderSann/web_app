import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';

import NavBar from './components/NavBar';
import { observer } from 'mobx-react-lite';
import { Spinner } from 'react-bootstrap';
import { Context } from './index.js';
import { check } from './https/userAPI';
import { NavLink, useLocation,useNavigate } from 'react-router-dom';


const App = observer(() => {
  const {user} = useContext(Context)
  const [loading,setLoading]=useState(true)
  useEffect( ()=>{
      check().then(data =>{
      if(data!==undefined){
      user.setUser(data)
      user.setIsAuth(true)
      }
    }).finally(()=>setLoading(false))
  },[])
  if(loading){
    return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ height: '100vh' }}
      >
      <Spinner animation="grow" style={{ transform: 'scale(2)' }} />
    </div>
    )
  }

  return (
    <BrowserRouter>
      <NavBar/>
      <AppRouter/>
    </BrowserRouter>
  );
});

export default App;
