const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=1b0c6095182d8b2231d8f6aa09c3fe62&query=' + latitude + ',' + longitude + '&units=f'

    request({ url, json: true }, (error, response) => {
        const { error: r_error, current: r_current } = response.body
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (r_error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, {
                cur: (r_current.weather_descriptions[0] + ". It is currently " + r_current.temperature + " degress out."),
                addlInfo: ("Feels like " + r_current.feelslike + ". Humidity " + r_current.humidity + "%")
            })
        }
    })
}

module.exports = forecast
