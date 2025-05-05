
import { $authHost,$host } from ".";


export const createOrder = async ( userId, itemId,  quantity, colorId, text, insta, number) =>{

    const {data} = await $authHost.post('api/order/', {userId, itemId, quantity, colorId, text, insta, number})
    return data
}

export const fetchOrders = async (page=1,limit=5,all=false) =>{
    const {data} = await $authHost.get('api/order/',{params:{
        page, limit,all
    }})
    return data
}
export const fetchUserOrders = async (userId) =>{
    const {data} = await $authHost.get(`api/order/${userId}`)
    return data
}
export const doComfirmed = async (orderId) => {
    const { data } = await $authHost.post('api/order/comfirmed', {
        orderId
    });
    return data;
};

export const doDone = async (orderId) => {
    const { data } = await $authHost.post('api/order/done', {
        orderId
    });
    return data;
};

export const deleteOrder = async (id) =>{
    const {data} = await $authHost.delete(`api/order/delete/${id}`)
    return data
}

export const updateOrder = async (id, quantity, colorId, text, insta, number) => {
    const { data } = await $authHost.post('api/order/update', {
        id, quantity, colorId, text, insta, number
    });
    return data;
};