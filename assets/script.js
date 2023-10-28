$(document).ready(function () {

    weatherCards = document.querySelector("#weather-cards")
    currentCity = document.querySelector("#city")
    cityId = "";

    $("#searchBtn").on("click", function () {
        var input = $("#input").val();
        var button = $("<button/>").text(input);
        $("#saved").append(button);
        getCity();
    });

    $(".clearBtn").on("click", function() {
    localStorage.clear();
    location.reload();
    });

    // Function to dynamically create the HTML elements to be documented
    var createWeatherCard = (cityName, weatherItem, index) => {
        if (index === 0) {
            return `<ul class="city-card">
                        <h1> ${cityName} (${weatherItem.dt_txt.split(" ")[0]})<img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather Icon"></img></h1>
                        <h3>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} C</h3>
                        <h3>Wind: ${weatherItem.wind.speed} M/S</h3>
                        <h3>Humidity: ${weatherItem.main.humidity} %</h3>
                    </ul>`;
        } else {
            return  `<ul class="col-sm card">
                        <h4> (${weatherItem.dt_txt.split(" ")[0]})</h4>
                        <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} C</h6>
                        <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                        <h6>Humidity: ${weatherItem.main.humidity} %</h6>
                        <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather Icon"></img>
                    </ul>`;
        };
    }
    // Function to obtain city details then create a new array for weather data for a single date //
    var getWeather = (cityName, lat, lon) => {
        var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid=d0fcce6012b326b116df7b9a8ea31123";

        fetch(weatherUrl)
            .then (function (response) {
            return response.json();
            })
        .then (function (data) {
            console.log(data);
            var dailyWeather = [];
            (data.list).splice(0, 4);
            for (i = 0; i <(data.list).length; i += 7){ 
            dailyWeather.push(data.list[i]);
            }
            console.log(dailyWeather);  
            
            currentCity.innerHTML = "";
            weatherCards.innerHTML = "";
            
        // Function to document the HTML 
            dailyWeather.forEach((weatherItem, index) => {
                if (index === 0) {
                currentCity.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                } else {
                weatherCards.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                }
            });
        });
    }    
    // Function to obtain city name, latitude and longitude from GeoCode API to use in Open Weather API//
    function getCity () {
        var cityName = $("#input").val();
        var requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid=d0fcce6012b326b116df7b9a8ea31123";

        fetch(requestUrl)
            .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            console.log(data);
            var {name, lat, lon} = data[0];
            getWeather(name, lat, lon);
        });
    };

});