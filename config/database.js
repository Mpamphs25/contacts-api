const mongoose = require('mongoose');
const config = require('config');

const conn = config.get('dbURL');

const DBconnection = async () =>{
    try {
      await  mongoose.connect(conn,{useNewUrlParser: true});
        console.log(`MONGODB CONNECTED`);
    } catch (err) {
        console.error(err.message);
    }
}

module.exports= DBconnection;