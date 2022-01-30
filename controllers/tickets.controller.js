const axios = require('axios')

const PAGES_AMOUNT = 5

const ticketsList = require('../assets/tickets.json')
const segmentsList = require('../assets/segments.json')

const segmentMap = new Map()
const companyMap = new Map()
let ticketsArray = []

const getTickets = (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, authorization'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')

  const queries = req.query

  if (!Object.keys(queries).length) {
    res.status(404).send('Page not found')
  } else {
    axios.get('http://localhost:5000/companies').then(response => {
      if (!companyMap.size) {
        response.data.forEach(company => {
          companyMap.set(company.id, {
            name: company.name,
            logo: company.logo,
            id: company.id
          })
        })
      }
    })
    axios.get('http://localhost:5000/segments').then(response => {
      if (!segmentMap.size) {
        response.data.forEach(elem => {
          segmentMap.set(elem.id, {
            price: elem.price,
            start: elem.dateStart,
            end: elem.dateEnd,
            origin: elem.origin,
            destination: elem.destination,
            stops: elem.stops,
            duration: elem.duration
          })
        })
      }
    })
    axios.get('http://localhost:5000/tickets/all').then(response => {
      const currentPage = queries.page - 1
      ticketsArray = response.data.map(elem => {
        const ticketSegments = elem.segments.map(item => {
          return segmentMap.get(item)
        })
        return {
          id: elem.id,
          price: elem.price,
          companyId: companyMap.get(elem.companyId),
          segments: ticketSegments
        }
      })

      if (queries.sort === 'cheapest') {
        ticketsArray = ticketsArray.sort((first, second) => first.price - second.price)
      }
      if (queries.sort === 'fastest') {
        ticketsArray = ticketsArray.sort((first, second) => {
          const firstPrice = first.segments.reduce((acc, elem) => elem.duration + acc, 0)
          const secondPrice = second.segments.reduce((acc, elem) => elem.duration + acc, 0)
          return firstPrice - secondPrice
        })
      }
      if (queries.sort === 'optimal') {
        ticketsArray = ticketsArray
          .sort((first, second) => first.price - second.price)
          .sort((first, second) => first.segments.length - second.segments.length)
      }

      const arrayEquals = (arr1, arr2) => {
        const sortedArr1 = [...new Set(arr1.sort())]
        const sortedArr2 = [...new Set(arr2.sort())]
        return sortedArr1.length === sortedArr2.length && sortedArr1
          .every((item, i) => sortedArr2[i] === item)
      }

      let connectAmount = queries.connectfilter
      let filteredByConnectsArray

      if (connectAmount && connectAmount !== 'all') {
        if (typeof queries.connectfilter === 'string') {
          connectAmount = Array.from(connectAmount)
        }
        filteredByConnectsArray = ticketsArray.filter(ticket => {
          const stopsArr = []
          ticket.segments.forEach(segment => {
            stopsArr.push(segment.stops.length.toString())
          })
          return arrayEquals(stopsArr, connectAmount)
        })
      } else if (connectAmount && connectAmount === 'all') {
        filteredByConnectsArray = ticketsArray
      } else {
        filteredByConnectsArray = []
      }

      let filteredByCompaniesArray
      const companyQuery = queries.company

      if (companyQuery) {
        filteredByCompaniesArray = filteredByConnectsArray.filter(ticket => {
          return ticket.companyId.logo === companyQuery
        })
      } else {
        filteredByCompaniesArray = filteredByConnectsArray
      }

      res.send(
        filteredByCompaniesArray.slice(currentPage * PAGES_AMOUNT, currentPage * PAGES_AMOUNT + PAGES_AMOUNT)
      )
    })
  }
}

const getSegments = (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, authorization'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.send(segmentsList)
}

const getAllTickets = (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, authorization'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.send(ticketsList)
}

module.exports = {
  getTickets,
  getAllTickets,
  getSegments
}
