const express = require('express');
const router  = express.Router();
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator');
const config = require('config')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/:id',(req,res)=>{
    res.send('FROM USER ' + req.params.id)
})


router.get('/',auth,(req,res)=>{
   // res.json({msg:'FROM USER'})
   res.send()
})


//register user
router.post('/',[
    check('name','Enter Your Name').not().isEmpty(),
    check('email','Enter Your Email').isEmail(),
    check('password','Your Password must be at least 6 characters').isLength({min:6})
],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name,email,password} = req.body;

    try {
        let user = await User.findOne({email});
        if(user){
            res.status(400).json({msg:'User already exists'});   
        }

       const newUser = new User({
            name,
            email,
            password
        })

         const salt = await bcrypt.genSalt(10);
         newUser.password = await bcrypt.hash(password,salt);
         
         const payload = {
            id: newUser.id,
         }

         jwt.sign(payload,config.get('mySecret'),
          {expiresIn:36000},(err,token)=>{
              if(err) throw err;
              res.json(token)
          }
         );

        await newUser.save();
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json({msg:'Server Error'});
    }
})


module.exports = router;