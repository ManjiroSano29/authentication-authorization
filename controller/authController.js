const User = require('../model/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const secretKey = process.env['ACCESS_KEY'];
const refreshKey = process.env['REFRESH_KEY'];

let refreshTokens = [];
const authController = {
  
  //REGISTER
  registerUser: async(req, res) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(req.body.password, salt);
    
    const new_user = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hashed
    });

    const user = await new_user.save();
    res.json('done');
  },

  //tạo access token
  createAccessToken: (user) => {
    return jwt.sign({
        id: user.id,
        admin: user.admin
      },
      secretKey,
      {expiresIn: "30s"}                       
      );
  },

  //tạo refresh token
  createRefreshToken: (user) => {
    return jwt.sign({
         id: user.id,
        admin: user.admin
      },
      refreshKey,
      {expiresIn: "30d"}
      );
  },
  //LOGIN
  loginUser: async(req, res) => {
    const user = await User.findOne({name: req.body.name});
    if(!user){
      return res.status(404).json('not found');
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
  )
    if (!validPassword){
      return res.status(404).json('wrong password');
    }
    if(user && validPassword){
      
      const token = authController.createAccessToken(user);
      const refreshToken = authController.createRefreshToken(user);

      refreshTokens.push(refreshToken);
      
      //lưu refresh token vào cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict"
      });
      
      res.status(200).json({token, refreshToken});
    }
  },

  requestRefreshToken: async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    //nếu refresh token ko phải của chính mk
    if(!refreshTokens.includes(refreshToken)){
      return res.status(403).json('this refresh token is not mine');
      
    }
    jwt.verify(refreshToken, refreshKey, (err, user) => {
      if(err){
        console.log(err);
      }

      
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      
      //tạo access token & refresh token mới
      const newAccessToken = authController.createAccessToken(user);
      const newRefreshToken = authController.createRefreshToken(user);

      refreshTokens.push(newRefreshToken);
      
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict"
      });
      res.status(200).json({accessToken: newAccessToken});
    });
  }
};

module.exports = authController;