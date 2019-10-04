const express = require('express');
const router  = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Contact = require('../models/Contact');

router.get('/',auth,async(req,res)=>{
   try {
       let user = await Contact.find({user:req.user.id});
       res.send(user);
   } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
   }
})


router.post('/',auth,async(req,res)=>{
    const {name,email,phone} = req.body;
    try {
        let contact = await new Contact({
            user: req.user.id,
            name,
            email,
            phone
        })


        await contact.save();
        res.send(200);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.put('/:id',auth,async(req,res)=>{
    const {name,email,phone} = req.body;
    const newContact = {};
    if(name)  newContact.name   = name;
    if(email) newContact.email =  email;
    if(phone) newContact.phone =  phone;
    try {
         let contact = await Contact.findById(req.params.id);
            if(!contact) {
                return res.status(401).json({msg:'Contact not found'})
            }
         contact =  await Contact.findByIdAndUpdate(req.params.id,{$set:newContact},{new:true});
         res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.delete('/:id',auth,async(req,res)=>{
    try {
        await Contact.findByIdAndRemove(req.params.id);
        res.json('Contact Deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


module.exports = router;