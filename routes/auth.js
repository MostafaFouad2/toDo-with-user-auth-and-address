const express = require('express');

const authController = require('../controllers/auth');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/usercountry', authController.getUserCountry);

router.post('/usercountry', authController.postUserCountry);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/usercountry/signup', authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/toDo', isAuth, authController.getToDo);

router.post('/toDo', isAuth, authController.postToDo);

router.post('/todo-edit', isAuth, authController.getEditToDo);

router.post('/editTask', isAuth, authController.postEditToDo);

router.post('/todo-delete', isAuth, authController.deleteToDo);

module.exports = router;