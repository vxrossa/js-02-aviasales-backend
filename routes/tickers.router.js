const express = require('express')
const { getAllTickets, getTickets, getSegments } = require('../controllers/tickets.controller')

const ticketsRouter = express.Router()

ticketsRouter.get('/tickets', getTickets)
ticketsRouter.get('/tickets/all', getAllTickets)
ticketsRouter.get('/segments', getSegments)

module.exports = ticketsRouter
