const config = require('config');
const jwt = require('jsonwebtoken')


module.exports = function(req,res,next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('No token found');

    try {
        const decoded = jwt.verify(token,config.get('mySecret'));
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}