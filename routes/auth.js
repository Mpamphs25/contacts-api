const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const config = require('config');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');


//get user
router.get('/',auth,async(req,res)=>{
   try {
    let user = await User.findById(req.user.id).select('-password');
    console.log(req.user.id);
    res.json(user)
   } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
   }
})


//login user
router.post('/',[
    check('email','Enter Your email').isEmail(),
    check('password','Enter Your password').isLength({min:6})
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password} = req.body;
    
    try {
        let user = await User.findOne({email});
        if(!user){
            res.status(400).json({msg:'Invalid Crendetials'});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            res.status(400).json({msg:'Invalid Crendetials'});
        }

        const payload = {
            id: user.id
        }

         jwt.sign(payload,config.get('mySecret'),
            {expiresIn:36000},(err,token)=>{
                if(err) throw err;
                res.json(token);
            }
         )
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;