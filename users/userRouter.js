const express = require('express');

const router = express.Router();

let database = require('./userDb.js');
let postDatabase = require('../posts/postDb.js');

router.post('/', validateUser(), (req, res) => {
  console.log(req.body);

  database.insert({name:req.body.name})
    .then( data => {
      res.status(200).json(data);
    })
    .catch( err => { res.status(500).json({errorMessage:"There was an error creating a user."})})

});

router.post('/:id/posts', validateUserId(), validatePost(), (req, res) => {
  let newPost = {text:req.body.text, user_id:req.user.id};

  postDatabase.insert(newPost)
    .then( data => {
      res.status(200).json(data);
    })
    .catch( err => { res.status(500).json({errorMessage:"There was an error creating a post."})})

});

router.get('/', (req, res) => {
  database.get()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an error retrieving the users."})})
});

router.get('/:id', validateUserId(), (req, res) => {

  database.getById(req.user.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an error retrieving the user."})})
});

router.get('/:id/posts', validateUserId(), (req, res) => {
  database.getUserPosts(req.user.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an error retrieving the user posts."})})

});

router.delete('/:id', validateUserId(), (req, res) => {
  database.remove(req.user.id)
    .then(data => {
      res.status(200).json({message:`removed ${data} record(s) from the database`});
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an error deleting the user."})})

});

router.put('/:id', validateUserId(), validateUser(), (req, res) => {


  database.update(req.user.id, {name: req.body.name})
    .then(data => {
      if(data === 1){
        res.status(200).json({message:`Before: id: ${req.user.id}, name: ${req.user.name} | After: id: ${req.user.id}, name: ${req.body.name}`})
      } else {
        res.status(500).json({errorMessage:"There was an error updating the user"});
      }
    })
    .catch(err => { res.status(500).json({errorMessage:"There was an error updating the user."})})

});

//custom middleware

function validateUserId() {

  return (req, res, next) => {
    database.getById(req.params.id)
      .then(data =>{
        if(data){
          req.user = data;
          next();
        } else {
          res.status(400).json({errorMessage:"invalid user id"});
        }
      })
      .catch(err => res.status(500).json({errorMessage:"Error while searching for user ID"}))
  }
}

function validateUser() {

  return (req, res, next) => {
    if(req.body){
      if(req.body.name){
        next();
      } else {
        res.status(400).json({errorMessage:"missing required name field"});
      }
    } else {
      res.status(400).json({errorMessage:"missing user data"});
    }
  }
}

function validatePost() {

  return (req, res, next) => {
    if(req.body){
      if(req.body.text){
        next();
      } else {
        res.status(400).json({errorMessage:"missing required text field"});
      }
    } else {
      res.status(400).json({errorMessage:"missing post data"});
    }
  }

}

module.exports = router;
