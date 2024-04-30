// userRoutes.js

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('home.ejs');
});

// router.get('/candidate/vote',async(req,res)=>{
//     res.render('vote.ejs')
// });

// router.get('/signup1', async (req, res) => {
//     res.render('signup.ejs');
// });

// router.get('/login1', async (req, res) => {
//     console.log("hello");
//     res.render('login3.ejs');
// });

// router.get('/addCandidates', async (req, res) => {
//     res.render('addcandidate.ejs');
// });

// router.get('/candidate/vote', async (req, res) => {
//     res.render('vote.ejs');
// });

module.exports = router;
