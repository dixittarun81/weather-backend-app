const request = require("request");

const forecast = (latitude, longitude, callback) => {
    const url =
      "http://api.weatherstack.com/current?access_key=20c531aacdf34c4876704e1e8b1373b9&query=" +
      latitude +
      "," +
      longitude +
      "&units=f";
  
    request({ url: url, json: true }, (error, response) => {
      if (error) {
        callback("Unable to connect to weather service");
      } else if (response.body.error) {
        console.log("Unable to find location");
      } else {
        callback(
          undefined,
          response.body.current.weather_descriptions[0] +
            ". It is currently " +
            response.body.current.temperature +
            " degrees out but it feels like " +
            response.body.current.feelslike
        );
      }
    });
  };

  module.exports = forecast;