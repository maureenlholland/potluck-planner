// Dependencies needed in all route files
const express = require('express');
const Router = express.Router;
const router = Router();

// Direct traffic - note these strings will prefix all routes within their respective files (i.e. inside auth.js '/login' will be '/auth/login')
router.use('/auth', require('./auth'));
router.use('/user', require('./user'));
router.use('/event', require('./event'));
router.use('/contribution', require('./contribution'));

// Also needed in every route!!!
module.exports = router;