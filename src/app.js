const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew Mead'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Mead'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Andrew Mead'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send('You must send address')
    } else {
        geocode((req.query.address), (error, data) => {
            if (error) {
                return res.send(error)
            }
            const { latitude: lat, longitude: long, location: loc } = data
            forecast(lat, long, (error, forecastData) => {
                if (error) {
                    return res.send('Unable get forecast: ' + error)
                }
                res.send({
                    forecast: forecastData,
                    location: loc,
                    address: req.query.address
                })
            })
        })
    }

})

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: 'Error',
        errorText: 'Help page not found - error 404',
        name: 'Andrew Mead'
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        title: 'Error',
        errorText: 'Page not found - error 404',
        name: 'Andrew Mead'
    })

})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})