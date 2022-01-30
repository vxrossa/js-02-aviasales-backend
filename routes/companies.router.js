const express = require('express')
const { getCompanies, getLogos } = require('../controllers/companies.controller')

const companiesRouter = express.Router()

companiesRouter.get('/companies/logos', getLogos)
companiesRouter.get('/companies', getCompanies)

module.exports = companiesRouter
