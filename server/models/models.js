const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: {type: DataTypes.STRING, unique: true},
    password:{type: DataTypes.STRING},
    role:{type: DataTypes.STRING, defaultValue:"USER"},
});

const Basket=sequelize.define('basket',{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true },
})

const BasketItem=sequelize.define('basket_item',{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true },
    quantity:{ type: DataTypes.INTEGER},
})
const Item=sequelize.define('item',{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true },
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
})
const ItemImage = sequelize.define('item_image', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    img: { type: DataTypes.STRING, allowNull: false },
});
const Rating=sequelize.define('rating',{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true },
    name: {type: DataTypes.INTEGER, allowNull: false},
})
const Type=sequelize.define('type',{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true },
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    typeId:{type: DataTypes.INTEGER, unique: true, allowNull: false},
})
const ItemInfo=sequelize.define('item_info',{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true },
    title: {type: DataTypes.STRING, allowNull: false},
    discription: {type: DataTypes.STRING, allowNull: false},
})
/*
const ItemComments=sequelize.define('item_coments',{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true },
})
const Comments=sequelize.define('comments',{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true },
    content: {type: DataTypes.STRING, allowNull: false},
})
*/
User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Basket.hasMany(BasketItem)
BasketItem.belongsTo(Basket)

Type.hasMany(Item)
Item.belongsTo(Type)

Item.hasMany(Rating)
Rating.belongsTo(Item)

Item.hasMany(BasketItem)
BasketItem.belongsTo(Item)

Item.hasMany(ItemInfo,{as:'info'})
ItemInfo.belongsTo(Item)

Item.hasMany(ItemImage, { as: 'img'});
ItemImage.belongsTo(Item);

module.exports = {
    User,
    Basket,
    BasketItem,
    Item,
    Type,
    Rating,
    ItemInfo,
    ItemImage
}