
import { $authHost,$host } from ".";


export const createType = async (name) =>{
    const {data} = await $authHost.post('api/type', {name})
    return data
}

export const fetchTypes = async () =>{
    const {data} = await $host.get('api/type')
    return data
}

export const deleteType = async (id) =>{
    const {data} = await $authHost.delete('api/type',  {data: {id}})
    return data
}


export const fetchColors = async () =>{
    const {data} = await $host.get('api/color')
    return data
}
export const createColor = async (name,code) =>{
    const {data} = await $authHost.post('api/color', {name,code})
    return data
}
export const deleteColor = async (id) =>{
    const {data} = await $authHost.delete('api/color',  {data: {id}})
    return data
}

export const createItem = async (formData) =>{
    const { data } = await $authHost.post('api/item', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
}

export const fetchItems = async (typeId,page,limit) =>{
    const {data} = await $host.get('api/item',{params:{
        typeId, page, limit
    }})
    return data
}
export const deleteItem = async (itemId) =>{
    const {data} = await $authHost.delete('api/item/remove',{data:{
        itemId
    }})
    return data
}
export const fetchOneItem = async (id) =>{
    const {data} = await $host.get(`api/item/${id}`)
    return data
}
