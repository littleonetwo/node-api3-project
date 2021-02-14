const express = require('express');
let database = require('../posts/postDb.js');

module.exports = (id) => {
  return (req, res, next) => {

    
    database.getById(id)
      .then(data =>{
        if(data.length > 0){
          req.user = data;
        } else {
          res.status(400).json({errorMessage:"invalid user id"});
        }
      })

      next();
  }
}
