
const jwt = require('jsonwebtoken');







const validateJWT = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    let result;
    if (authorizationHeader) {
      const token = req.header('authorization').split(' ')[1]; // Bearer <token>
    
      try {
     
        result = jwt.verify(token, 'your_secret_key');
       
        req.user = result;
    
        next();
      } catch (err) {
      
        throw new Error(err);
      }
    } else {
      result = { 
        error: `Authentication error. Token required.`,
        status: 401
      };
      res.status(401).send(result);
    }
  }
  
  module.exports=validateJWT