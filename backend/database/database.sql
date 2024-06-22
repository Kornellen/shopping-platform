create database if not exists shopping_platform;

use shopping_platform;


create table Users (
    userID int primary key auto_increment,
    username varchar(255),
    email varchar(255),
    password varchar(64),
    firstName varchar(255),
    lastName varchar(255),
    phoneNumber varchar(20),
    birthdate date,
    gender varchar(20),
    createdAt datetime,
    updatedAt datetime
);

------------------

create table Addresses (
    addressID int primary key auto_increment,
    userID int,
    addressLine varchar(255),
    city varchar(100),
    state varchar(100),
    postalCode varchar(20),
    country varchar(100),
    createdAt datetime,
    updatedAt datetime,
    foreign key (userID) references Users(userID) on delete cascade
);

------------------

create table Categories (
    categoryID int primary key auto_increment,
    parentID int,
    name varchar(255),
    description text,
    foreign key (parentID) references Categories(categoryID) on delete set null
);

------------------

create table Products (
    productID int primary key auto_increment,
    categoryID int,
    name varchar(255),
    description text,
    price decimal(10,2),
    stockQuantity int,
    addedAt datetime,
    updatedAt datetime,
    foreign key (categoryID) references Categories(categoryID) on delete set null
);

------------------

create table Orders (
    orderID int primary key auto_increment,
    userID int,
    orderDate date,
    status enum('sent', 'ordered', 'cancelled', 'recived', 'destroyed'),
    totalAmount decimal(10,2),
    shoppingAddressID int,
    billingAddressID int,
    foreign key (userID) references Users(userID) on delete cascade,
    foreign key (shoppingAddressID) references Addresses(addressID) on delete set null,
    foreign key (billingAddressID) references Addresses(addressID) on delete set null
);

------------------

create table OrderItems (
    orderItemID int primary key auto_increment,
    orderID int,
    productID int,
    quantity int,
    price decimal(10,2),
    foreign key (orderID) references Orders(orderID) on delete cascade,
    foreign key (productID) references Products(productID) on delete cascade
);

------------------

create table PaymentMethods (
    paymentMethodID int primary key auto_increment,
    paymentMethod enum("CARD", "BLIK", "CASH")
);

------------------

create table Payments (
    paymentID int primary key auto_increment,
    orderID int,
    paymentDate datetime,
    amount decimal(10, 2),
    paymentMethodID int,
    status enum('paid', 'cancelled'),
    foreign key(orderID) references Orders(orderID) on delete cascade,
    foreign key (paymentMethodID) references PaymentMethods(paymentMethodID) on delete set null
);

------------------

create table Reviews (
    reviewID int primary key auto_increment,
    productID int,
    userID int,
    rating int,
    comment text,
    createdAt datetime,
    foreign key (productID) references Products(productID) on delete cascade,
    foreign key (userID) references Users(userID) on delete cascade
);

------------------

create table Wishlists (
    wishlistID int primary key auto_increment,
    userID int,
    createdAt datetime,
    foreign key (userID) references Users(userID) on delete cascade
);

------------------

create table WishlistItems (
    wishlistItemID int primary key auto_increment,
    wishlistID int,
    productID int,
    foreign key (wishlistID) references Wishlists(wishlistID) on delete cascade,
    foreign key (productID) references Products(productID) on delete cascade
);

------------------

create table Cart (
    cartID int primary key auto_increment,
    userID int,
    createdAt datetime,
    updatedAt datetime,
    foreign key (userID) references Users(userID) on delete cascade
);

------------------

create table CartItems (
    CartItemsID int primary key auto_increment,
    cartID int,
    productID int,
    quantity int,
    foreign key (cartID) references Cart(cartID) on delete cascade,
    foreign key (productID) references Products(productID) on delete cascade
);

------------------

create table ProductAttributes (
    attributeID int primary key auto_increment,
    productID int,
    attributeName varchar(255),
    attributeValue varchar(255),
    foreign key (productID) references Products(productID) on delete cascade
);


------------------

create table ShippingMethods (
    shippingMethodID int primary key auto_increment,
    name varchar(255),
    description text,
    cost decimal(10,2),
    createdAt datetime,
    updatedAt datetime
);

------------------

create table ReturnsRequests (
    requestID int primary key auto_increment,
    orderID int,
    userID int,
    reason text,
    status varchar(50),
    createdAt datetime,
    updatedAt datetime,
    foreign key (orderID) references Orders(orderID) on delete cascade,
    foreign key (userID) references Users(userID) on delete cascade
);

