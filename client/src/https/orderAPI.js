
import { $authHost,$host } from ".";


export const createOrder = async ( userId, itemId, quantity, text, insta, tg) =>{
    const {data} = await $authHost.post('api/orde/r', {userId, itemId, quantity, text, insta, tg})
    return data
}

export const fetchOrders = async () =>{
    const {data} = await $host.get('api/order/')
    return data
}

export const deleteOrder = async (id) =>{
    const {data} = await $authHost.delete('api/order/', {id})
    return data
}
s
export const updateOrder = async (id,quantity, text, insta, tg) =>{
    const {data} = await $authHost.post('api/order/', {id,quantity, text, insta, tg})
    return data
}