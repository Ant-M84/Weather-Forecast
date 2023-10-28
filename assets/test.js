$(document).ready(function () {

    weatherCards = $("#weather-cards");
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

    var createWeatherCard = (weatherItem) => {
        return  `<li class="col-sm card">
                    <h4>(${weatherItem.dt_txt.split(" ")[0]})</h4>
                    <h6>Temp: ${(weatherItem.main.temp)}F</h6>
                    <h6>Wind: ${(weatherItem.wind.speed)}M/S</h6>
                    <h6>Humidity: ${(weatherItem.main.humidity)}%</h6>
                </li>`;
    };
    // Function to obtain city details then create a new array for weather data for a single date //
    var getWeather = (cityName, lat, lon) => {
        var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid=d0fcce6012b326b116df7b9a8ea31123";

        fetch(weatherUrl)
            .then (function (response) {
            return response.json();
            })
        .then (function (data) {
            var dailyWeather = [];
            for (i = 0; i <(data.list).length; i += 7){ 
            dailyWeather.push(data.list[i]);
            }
            console.log(dailyWeather);
            
            dailyWeather.forEach(weatherItem => {
                $("#weather-cards").insertAdjacentHTML("beforeend", createWeatherCard(weatherItem)); 
            });
        });
    }    
    // Function to obtain city name, latitude and longitude from GeoCode API to use in Open Weather API//
    function getCity () {
        var cityName = $("#input").val();
        var requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid=d0fcce6012b326b116df7b9a8ea31123";

        fetch(requestUrl)
            .then (function (response) {$("#city").append($("<h2/>"))
            return response.json();
        })
        .then (function (data) {
            console.log(data);
            var {name, lat, lon} = data[0];
            getWeather(name, lat, lon);
            var cityId = data[0].name;
            $("#city").append($("<h1/>")).text(cityId);
        });
    };

});
// Function to create weather data cards for HTML //
