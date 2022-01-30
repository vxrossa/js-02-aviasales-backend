const express = require('express')
const companiesRouter = require('./routes/companies.router')
const ticketsRouter = require('./routes/tickers.router')

const app = express()

const PORT = process.env.PORT || 5000

app.use(companiesRouter)
app.use(ticketsRouter)

app.listen(PORT)
