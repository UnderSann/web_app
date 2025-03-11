import { $authHost,$host } from ".";
import { jwtDecode } from "jwt-decode"; 



export const registration = async (email, password) =>{
    const {data} = await $host.post('api/user/registration', {email,password,role:'ADMIN'})
     localStorage.setItem('token',data.token)   
    return jwtDecode(data.token)
}

export const login = async (email, password) =>{
    const {data} = await $host.post('api/user/login', {email,password})
    localStorage.setItem('token',data.token)
    return jwtDecode(data.token)
}
export const check = async () =>{
    try{
        const {data}= await $authHost.get('api/user/auth')
        localStorage.setItem('token',data.token)
        return jwtDecode(data.token)
    }catch(e){
            localStorage.removeItem('token');
            alert(e.response.data.message);
    }
}