
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
export const fetchItems = async (filters = {}) => {
    const {
        typeId = null,     // массив ID или null
        colors = null,     // массив ID или null
        minPrice = null,
        maxPrice = null,
        page = 1,
        limit = 10,
        query = ''
    } = filters;
    //console.log("typeId[0]?.name\n\n\n"+colors+"\n\n\n")
    const params = {
        page,
        limit,
    };

    // Если typeId не null и является массивом, конвертируем его в строку с разделителем
    if (typeId && Array.isArray(typeId) && typeId.length > 0) {
        params.typeId = typeId.join(','); // => ?typeId=1,2,3
    }

    if (colors && Array.isArray(colors) && colors.length > 0) {
        params.colors = colors.join(','); // => ?colors=4,5
    }

    if (minPrice !== null) params.minPrice = minPrice;
    if (maxPrice !== null) params.maxPrice = maxPrice;
    if (query) params.query = query;

    const { data } = await $host.get('api/item', { params });
    return data;
};



export const updateItem = async (itemId,formData) =>{
    const { data } = await $authHost.post(`api/item/update/${itemId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
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
