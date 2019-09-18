const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const models = dbModule.models;
const { Course, User } = models;
const bcryptjs = require('bcryptjs');


//R E T U R N S   O N L Y  T H E   C U R R E N T   A U T H E N T I C A T E D   U S E R

const authenticateUser = require('../authenticate');



 router.get('/', authenticateUser, async (req, res) => {
  const user = await User.findByPk(req.body.id);
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    })
});

 //------------------------------------------------------------------------------------------------

//RETURNS AN ERROR IF AUTHENTICATED CREDENTIALS ARE NOT MET
 //Rescources used https://www.abeautifulsite.net/hashing-passwords-with-nodejs-and-bcrypt
router.post('/',async(req, res, next) => {
  try{
      req.body.password = bcryptjs.hashSync(req.body.password)
   await User.create(req.body)
      res.location('/');
      res.status(201).end()
} catch(err){
    if (err.name === "SequelizeValidationError" || "SequelizeUniqueConstraintError") {
      res.status(400).json({error: err.message})
    } else {
      return next(err);
    }
  }
})
  
module.exports = router