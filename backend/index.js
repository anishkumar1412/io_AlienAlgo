const port = 4000;
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { type } = require('os');
const cloudinary = require('cloudinary').v2;
// Load environment variables from .env file

const app = express();

app.use(express.json());
app.use(cors());

// Cloudinary configuration
cloudinary.config({
    cloud_name: "dqbixsjof",
    api_key: "241939828153228",
    api_secret: "MUkbTQkwdZD9PWgTj9giFYnDvlg",
});

// Database connection with MongoDB
mongoose.connect("mongodb+srv://alkab:alkab123@cluster0.zpdqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// API creation
app.get('/', (req, res) => {
    res.send("Express App is Running");
});

// Use multer for file upload without specifying the storage
const upload = multer({ dest: 'upload/temp' }); // Temporary directory for multer

// Creating Upload end point for image
app.post('/upload', upload.single('product'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        res.json({
            success: true,
            image_url: result.secure_url // Get the secure URL from Cloudinary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Image upload failed",
            error: error.message
        });
    }
});

// Schema for creating product
const Product = mongoose.model("product", {
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true
    },
    quantity: {
        type: Number,
        required: true,
    }
});

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;

    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }

    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image, // This will now store the Cloudinary URL
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        quantity: req.body.quantity
    });

    await product.save();
    res.json({
        success: true,
        name: req.body.name,
    });
});

// Creating API for deleting products
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({
        success: true,
        name: req.body.name
    });
});

// Creating API for getting all products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    res.send(products);
});

// Schema for user model
const User = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    cartData: {
        type: Object
    },
    data: {
        type: Date,
        default: Date.now,
    }
});

// Creating endpoint for registering the user
app.post('/signup', async (req, res) => {
    let check = await User.findOne({ email: req.body.email });

    if (check) {
        return res.status(400).json({
            success: false,
            errors: "Existing user found with the same email address"
        });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }

    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    };

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
});

// Creating endpoint for user login
app.post('/login', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
        const passCompare = req.body.password === user.password;

        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            };
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        } else {
            res.json({ success: false, errors: "Wrong Password" });
        }
    } else {
        res.json({ success: false, errors: "Wrong email ID" });
    }
});

// Creating new endpoint for new collections
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    res.send(newcollection);
});

// Creating new endpoint for popular in women
app.get('/popularinelectronics', async (req, res) => {
    let products = await Product.find({ category: "electronics" });
    let popularinwomen = products.slice(0, 4);
    res.send(popularinwomen);
});

// Creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({
            errors: "Please authenticate using a valid token"
        });
    }
    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

// Creating endpoint for cart data
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        let userData = await User.findOne({ _id: req.user.id });

        if (!userData) {
            return res.status(404).send("User not found");
        }

        const itemId = req.body.itemId;

        if (!itemId) {
            return res.status(400).send("Item ID is required");
        }

        if (userData.cartData[itemId]) {
            userData.cartData[itemId] += 1;
        } else {
            userData.cartData[itemId] = 1;
        }

        await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Added");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Creating endpoint to remove product from cart data
app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        let userData = await User.findOne({ _id: req.user.id });

        if (!userData) {
            return res.status(404).send("User not found");
        }

        const itemId = req.body.itemId;

        if (!itemId) {
            return res.status(400).send("Item ID is required");
        }

        if (userData.cartData[itemId] > 0) {
            userData.cartData[itemId] -= 1;
        }

        await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Removed");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Creating endpoint for getting cart data
app.post('/getcart', fetchUser, async (req, res) => {
    let userData = await User.findOne({ _id: req.user.id });
    res.json(userData.cartData);
});

// Schema for order list
// const orderSchema = mongoose.model('orderList', {
//     customerName: { type: String, required: true },
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     pin: { type: String, required: true },
//     paymentMethod: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     total: { type: Number, required: true },
//     products: [
//         {
//             id: { type: Number, required: true },
//             name: { type: String, required: true },
//             price: { type: Number, required: true },
//             quantity: { type: Number, required: true },
//             total: { type: Number, required: true }
//         }
//     ]
// });

// Adding order to order list
// app.post('/addorderlist', async (req, res) => {
//     try {
//         console.log('Request body:', req.body); // Log the request body to verify the data

//         const order = new orderSchema({
//             customerName: req.body.customerName,
//             address: req.body.address,
//             city: req.body.city,
//             pin: req.body.pin,
//             paymentMethod: req.body.paymentMethod,
//             quantity: req.body.quantity,
//             total: req.body.total,
//             products: req.body.products, // This should match the structure sent from frontend
//         });

//         await order.save();
//         res.json({
//             success: true,
//             message: 'Order placed successfully',
//         });
//     } catch (error) {
//         console.error('Error:', error); // Log the full error
//         res.status(500).json({
//             success: false,
//             message: 'Failed to place order',
//             error: error.message,
//         });
//     }
// });

const orderSchema = new mongoose.Schema({
    customerName: String,
    address: String,
    city: String,
    pin: String,
    paymentMethod: String,
    quantity: Number,
    total: Number,
    products: [{
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        total: Number,
        image: String // Ensure image is included in the schema
    }]
});

const OrderList = mongoose.model('OrderList', orderSchema);

// API endpoint to add order list
app.post('/addorderlist', async (req, res) => {
    const order = new OrderList({
        customerName: req.body.customerName,
        address: req.body.address,
        city: req.body.city,
        pin: req.body.pin,
        paymentMethod: req.body.paymentMethod,
        quantity: req.body.quantity,
        total: req.body.total,
        products: req.body.products // Save product details, including images
    });

    try {
        await order.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ success: false, message: 'Failed to save order' });
    }
});





// creatign api for getting all order product 

app.get('/orderProducts', async (req, res) => {
    let orderProducts = await OrderList.find({})
    res.send(orderProducts);
})

// Starting the server
app.listen(port, (err) => {
    if (!err) {
        console.log("Server running on Port " + port);
    } else {
        console.log("Error  " + err);
    }
});