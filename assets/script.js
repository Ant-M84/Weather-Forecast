$(document).ready(function () {

    weatherCards = document.querySelector("#weather-cards");
    currentCity = document.querySelector("#city");
    oldInput = document.querySelector("#input");

    // Code to search based on user input //
    $("#searchBtn").on("click", function () {
        var input = $("#input").val();
        var button = $("<button id='historyBtn'>").text(input);
        $("#saved").append(button);
        getCity();
    });

    // Code to allow search history to be refreshed //
    $(document).on("click","#historyBtn", function () {
        var newInput= (this).innerHTML;
        var cityName = newInput;
        var requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid=d0fcce6012b326b116df7b9a8ea31123";

        fetch(requestUrl)
            .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            var {name, lat, lon} = data[0];
            getWeather(name, lat, lon);
        });
    });

    // Code to clear page history //
    $(".clearBtn").on("click", function() {
    location.reload();
    });

    // Code to dynamically create the HTML elements to be documented //
    var createWeatherCard = (cityName, weatherItem, index) => {
        if (index === 0) {
            return `<ul class="city-card">
                        <h2> ${cityName} (${weatherItem.dt_txt.split(" ")[0]})<img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather Icon"></img></h2>
                        <h3>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} °C</h3>
                        <h3>Wind: ${weatherItem.wind.speed} M/S</h3>
                        <h3>Humidity: ${weatherItem.main.humidity} %</h3>
                    </ul>`;
        } else {
            return  `<ul class="col-sm card">
                        <h5> (${weatherItem.dt_txt.split(" ")[0]})</h5>
                        <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} °CC</h6>
                        <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                        <h6>Humidity: ${weatherItem.main.humidity} %</h6>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather Icon"></img>
                    </ul>`;
        };
    }

    // Code to obtain city details then create a new array using details for a single date //
    var getWeather = (cityName, lat, lon) => {
        var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid=d0fcce6012b326b116df7b9a8ea31123";

        fetch(weatherUrl)
            .then (function (response) {
            return response.json();
            })
        .then (function (data) {
            var dailyWeather = [];
            for (i = 0; i <(data.list).length; i += 7){ 
            dailyWeather.push(data.list[i]);
            } 
            currentCity.innerHTML = "";
            weatherCards.innerHTML = "";        
            
        // Code to document the data dynamically to the DOM //
            dailyWeather.forEach((weatherItem, index) => {
                if (index === 0) {
                currentCity.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                } else {
                weatherCards.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                }
            });
        });
    }   
     
    // Code to obtain city name, latitude and longitude from GeoCode API to use in OpenWeatherMap API//
    function getCity () {
        var cityName = $("#input").val();
        var requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid=d0fcce6012b326b116df7b9a8ea31123";

        fetch(requestUrl)
            .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            var {name, lat, lon} = data[0];
            getWeather(name, lat, lon);
        });
    };
    
});