const express = require('express');
var bodyParser = require('body-parser')
const router = express.Router();
const User = require('./../models/user');
const jwt = require('jsonwebtoken');

const {generateToken,authorize} = require('./../jwt');

const app = express();
app.use(bodyParser.json());

router.get('/dashboard',async(req,res)=>{
    res.render('home.ejs');
});

router.get('/login1',async(req,res) =>{
    res.render('login3.ejs');
});

router.get('/addCandidates',async(req,res) => {
    res.render('addcandidate.ejs');
});

router.get('/candidate/vote',async(req,res)=>{
    res.render('vote.ejs')
});


router.post('/signup', async (req, res) =>{
    try{
        const data = req.body ;
        const adminUser = await User.findOne({ role: 'admin' });

        //this will insure that only one admin can be there
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        if (!/^\d{12}$/.test(data.aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }

        //to check the data base for addcardm=number
        const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        const newUser = new User(data);

        const response = await newUser.save();
        console.log('data saved');

        // const payload = {
        //     id: response.id
        // }
        // console.log(JSON.stringify(payload));
        // const token = generateToken(payload);

        res.render('login3.ejs');
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


router.post('/login', async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;
        if (!aadharCardNumber || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
        }
        const user = await User.findOne({ aadharCardNumber });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid Aadhar Card Number or Password' });
        }
        const payload = {
            id: user.id,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true }); 

        res.render('home2.ejs');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Profile route
router.get('/profile', authorize , async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const token = req.cookies.token;
        const user = await User.findById(userId);
        //removed token from here
        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;