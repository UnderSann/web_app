const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketItem = sequelize.define('basket_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER },
});

const Item = sequelize.define('item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
});
const ColorItemConnector = sequelize.define('color_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});
const Color = sequelize.define('color', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    code: { type: DataTypes.STRING(7), allowNull: false },
});

const ItemImage = sequelize.define('item_image', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    img: { type: DataTypes.STRING, allowNull: false },
});

const Rating = sequelize.define('rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.INTEGER, allowNull: false },
});

const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const ItemInfo = sequelize.define('item_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    discription: { type: DataTypes.TEXT, allowNull: false },
});

const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false }, 
    number: { type: DataTypes.STRING,allowNull: false },
    text: { type: DataTypes.TEXT },
    insta: { type: DataTypes.STRING },
    comfirmed:{ type: DataTypes.BOOLEAN, defaultValue: false},
    done:{ type: DataTypes.BOOLEAN, defaultValue: false},
});

// Связи
User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Basket.hasMany(BasketItem);
BasketItem.belongsTo(Basket);

Type.hasMany(Item);
Item.belongsTo(Type);

Item.hasMany(Rating);
Rating.belongsTo(Item);

Item.hasMany(BasketItem);
BasketItem.belongsTo(Item);

Item.hasMany(ItemInfo, { as: 'info' });
ItemInfo.belongsTo(Item);

Item.hasMany(ItemImage, { as: 'imgs' });
ItemImage.belongsTo(Item);

Order.belongsTo(Item);
Item.hasMany(Order);

Order.belongsTo(Color);
Color.hasMany(Order);

User.hasMany(Order, { as: 'orders' });
Order.belongsTo(User);

Item.belongsToMany(Color, { through: ColorItemConnector, as: 'colors' });
Color.belongsToMany(Item, { through: ColorItemConnector });


module.exports = {
    User,
    Basket,
    BasketItem,
    Item,
    Type,
    Rating,
    ItemInfo,
    ItemImage,
    Order,
    Color,
    ColorItemConnector
};
