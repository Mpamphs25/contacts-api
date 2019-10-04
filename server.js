const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const userRouter = require('./routes/Users');
const authRouter = require('./routes/auth');
const contactRouter = require('./routes/Contacts');
const DBconnection = require('./config/database');

DBconnection();

app.use(express.json())

app.use('/contacts',contactRouter);
app.use('/users',userRouter);
app.use('/auth',authRouter);


app.get('/',(req,res)=> res.send('Hello World'));

app.listen(port,()=>console.log(`The app is listening on port ${port}!`));