const express = require("express");
const path = require("path");
const hbs = require("hbs");

const geocode = require('./utils/geocode');
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

//paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Tarun Dixit",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpTxt: "Hey i could give some help here!",
    title: "Help",
    name: "Tarun Dixit",
  });
});

app.get("/weather", (req, res) => {
  if(!req.query.address) {
      return res.send({
          error : 'You must provide an address'
      })
  }

  geocode(req.query.address, (error, {latitude,longitude,location} = {}) => {
    if (error) {
        return res.send({
            error : error
        })
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({
            error : error
        })
      }

      res.send({
        address : req.query.address,
        location,
        forecast : forecastData
    
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    errorMsg: "Couldn't Found Help Article",
    title: "404",
    name: "Tarun Dixit",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    errorMsg: "Page Not Found",
    title: "404",
    name: "Tarun Dixit",
  });
});

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
