const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {generateToken, authorize} = require('../jwt');
const Candidate = require('../models/candidate');
const { authenticate } = require('passport');

const app = express();


router.get('/login1',async(req,res) =>{
    console.log("hello");
    res.render('login3.ejs');
});

router.get('/candidate/vote',async(req,res)=>{
    res.render('vote.ejs')
});

const checkAdminRole = async (userID) => {
   try{
        const user = await User.findById(userID);
        if(user.role === 'admin'){
            return true;
        }
   }catch(err){
        return false;
   }
}

router.post('/add', authorize , async (req, res) =>{
    try{
        if(!(await checkAdminRole(req.user.id)))
            return res.status(403).json({message: 'user does not have admin role'});

        const data = req.body
        const newCandidate = new Candidate(data);

        // Save the new user to the database
        const response = await newCandidate.save();
        console.log('data saved');
        res.render('home2.ejs');
        //res.status(200).json({response: response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//to update
//to delete


router.post('/vote/:candidateID', authorize , async (req, res)=>{
    // no admin can vote
    // user can only vote once
    
    candidateID = req.params.candidateID;
    userId = req.user.id;

    try{
        // Find the Candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'user not found' });
        }
        if(user.role == 'admin'){
            return res.status(403).json({ message: 'admin is not allowed'});
        }
        if(user.isVoted){
            return res.status(400).json({ message: 'You have already voted' });
        }

        candidate.votes.push({user: userId})
        candidate.voteCount++;
        await candidate.save();

        // update the user document
        user.isVoted = true
        await user.save();

        return res.status(200).json({ message: 'Vote recorded successfully' });
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});

// vote count 
router.get('/vote/count', async (req, res) => {
    try{
        const candidate = await Candidate.find().sort({voteCount: 'desc'});
        const voteRecord = candidate.map((data)=>{
            return {
                name : data.name,
                party: data.party,
                count: data.voteCount || 0
            }
        });
        console.log(voteRecord);

        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/profile', authorize , async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const token = req.cookies.token;
        const user = await User.findById(userId);
        res.status(200).json({user,token});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find({}, 'name party _id');
        res.status(200).json(candidates);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;