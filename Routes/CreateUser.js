const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const { reset } = require('nodemon');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = "MyNameisMrunalKotianIam22YEngineeringStudent";



router.post("/createuser", [
    body('email').isEmail(),
    body('password','Password is not long enough').isLength({ min: 5 }),
    body('name',"Name is too short").isLength({ min: 5 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password,salt)
        await User.create({
            // name:"Nikhil Walunj",
            // password:"123456",
            // email:"nikhil@gmail.com",
            // location:"Dombivili"
            name: req.body.name,
            password: secPassword,
            email: req.body.email,
            location: req.body.location
        }).then(res.json({ success: true }));
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});


router.post("/loginuser",[
    body('email').isEmail(),
    body('password','Password is not long enough').isLength({ min: 5 }),
],async (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    let email = req.body.email;
    try {
       let userData =   await User.findOne({email});
       if(!userData){
        return res.status(400).json({ errors: "Try Logging In with Correct Credentials"});
       }
       const pwdCompare = await bcrypt.compare(req.body.password,userData.password);
       console.log(pwdCompare);
       if(!pwdCompare){
         return res.status(400).json({ errors: "Try Logging In with Correct (p)Credentials"});
       }

        //   if(userData.password !== req.body.password){
        //     return res.status(400).json({ errors: "Try Logging In with Correct (p)Credentials"});
        //   }

       //Data has to be an Object so {{}}
       const data = {
        user:{
            id:userData.id
        }
       }

       const authToken = jwt.sign(data,jwtSecret)

       return res.json({success:true,authToken:authToken});
    //    return res.json({success:true});
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

module.exports = router;