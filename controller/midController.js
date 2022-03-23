const jwt = require('jsonwebtoken');
const secretKey = process.env['ACCESS_KEY'];

//VERIFY TOKEN
const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if(token){
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, secretKey, (err, user) => {
      if(err){
      return res.status(403).json('token is not valid');
      }
      req.user = user;
      next();
    });
  }else{
    res.status(401).json('you are not authenticated');
  }
};
  
//VERIFY ADMIN
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.admin) {
      next();
    }else{
      return res.status(403).json("You're not allowed to do that!");
    }
  });
};

  
    
    
module.exports = {verifyToken,
                  verifyAdmin};