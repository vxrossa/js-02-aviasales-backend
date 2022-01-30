const companiesList = require('../assets/companies.json')
const path = require('path')

const getCompanies = (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, authorization'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.send(companiesList)
}

const getLogos = (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, authorization'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  const logoPath = req.query.name
  const filePath = path.join(__dirname, '..', 'assets', 'images', `${logoPath}.png`)
  res.sendFile(filePath)
}

module.exports = { getCompanies, getLogos }
