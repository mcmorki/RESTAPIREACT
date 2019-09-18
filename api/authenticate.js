const express = require('express');
const dbModule = require('./db')
const models = dbModule.models;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

const { User } = models;


const authenticateUser = (req, res, next ) => {
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);
  
    if (credentials) {

      User.findOne({
          where : {
            emailAddress : credentials.name
          }
        }).then(user => {
            // if user is found compare password "key" 
          if (user) {
            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

            if (authenticated) {
              console.log(`Authentication successful for user with email Address: ${user.emailAddress}`);
 
              if (req.originalUrl.includes('courses')) {
                req.body.userId = user.id;
            } else if (req.originalUrl.includes('users')) {
                req.body.id = user.id;
            }
               next();
            } else {
              console.log(`Authentication failure for user with email Address: ${user.emailAddress}`);
              res.status(401).json({ message: 'Access Denied' });
            } 
          } else {
            console.log( `User not found with email Address: ${credentials.name}`);
            res.status(401).json({ message: 'Access Denied' });
          }   
        })
      } else {
        console.log('Auth header not found');
        res.status(401).json({ message: 'Access Denied' });
      }
  }

  module.exports = authenticateUser
  