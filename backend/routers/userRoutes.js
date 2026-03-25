const express = require('express')
const route = express.Router()
const { createEmployee,loginEmployee,getAllEmployees, syncCustomer } = require('../controllers/AuthController')



route.post('/register',createEmployee)
route.post('/login',loginEmployee)
route.get('/getall',getAllEmployees)

route.post("/sync", syncCustomer);

module.exports = route