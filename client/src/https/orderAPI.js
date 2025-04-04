
import { $authHost,$host } from ".";


export const createOrder = async ( userId, itemId,  quantity, colorId, text, insta, tg) =>{

    const {data} = await $authHost.post('api/order/', {userId, itemId, quantity, colorId, text, insta, tg})
    return data
}

export const fetchOrders = async () =>{
    const {data} = await $authHost.get('api/order/')
    return data
}
export const fetchUserOrders = async (userId) =>{
    
    const {data} = await $authHost.get(`api/order/${userId}`)
    return data
}

export const deleteOrder = async (id) =>{
    const {data} = await $authHost.delete('api/order/delete', {id})
    return data
}

export const updateOrder = async (id,quantity, text, insta, tg) =>{

    const {data} = await $authHost.post('api/order/update', {id,quantity, text, insta, tg})
    return data
}