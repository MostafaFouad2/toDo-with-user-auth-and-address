const express = require('express');

const addressController = require('../controllers/address');

const router = express.Router();

router.get('/', addressController.getIndex);

router.get('/country', addressController.getAddCountry);

router.post('/country', addressController.postAddCountry);

router.get('/countries/:id', addressController.getcities);

router.post('/citey', addressController.postAddCitey);

router.post('/delete-address', addressController.postDeleteAddress);

router.post('/edit-address', addressController.getEditAddress);

router.post('/editAddr', addressController.postEditAddress);


module.exports = router;
