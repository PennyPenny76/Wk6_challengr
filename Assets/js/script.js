var cityForm = $('#city-form');
var cityNameEl = $("#cityname");
var cityListEl =$('#city-list');
var cityTodayName = $('#city-today-name');

// var cityNames = [];

function readCitysFromStorage(){

  var cityNames = localStorage.getItem('cityNames');

  if (cityNames) {
    cityNames = JSON.parse(cityNames);
    
    } else {
      cityNames = []; 
    }
    return cityNames;  
}

function PrintCityNames(){
    cityListEl.empty();
    var cityNames = readCitysFromStorage();

    for (var i = 0; i < cityNames.length; i +=1) {
    
      var city = $("<button>");
      city.attr("id", cityNames[i]);
      city.addClass("btn", "btn-grey");
      cityListEl.append(city);
      city.text(cityNames[i]);
  
    cityNameEl.val("");
    }
}

function saveCityToLocalstorage(cityName){  
  var cityNames = readCitysFromStorage();
  cityNames.push(cityName);
  localStorage.setItem("cityNames", JSON.stringify(cityNames));
  PrintCityNames();
}

function printWeatherCurrent(name ,lat, lon){

  var currentApi = 'https://api.openweathermap.org/data/2.5/weather?lat=' 
  + lat + '&lon=' + lon + '&appid=31c30af2774d795facb1e2d367b1f25d'

  fetch(currentApi)
  .then(function (response) { 
    if (!response.ok) {
      throw response.json();
    }
    return response.json();
  })

  .then(function (data) {
    console.log('data', data);

    var date = dayjs();
    var icon = data.weather[0].icon;

    var temp = data.main.temp;
    var wind = data.wind.speed;
    var humidity = data.main.humidity;

    var tempEl = $("<li>");
    tempEl.text('Temp: ' + temp + ' °F');
    var windEl = $("<li>");
    windEl.text('Wind: ' + wind + ' MPH');
    var humidityEl = $("<li>");
    humidityEl.text('Humidity: ' + humidity + ' %');

    $('#weather-today').append(tempEl, windEl, humidityEl );
    cityTodayName.text(name + '(' + date.format('MMM D, YYYY') + ')' + icon);
  })
}

function printWeatherFivedays(name ,lat, lon){
  var fivedayApi = 'https://pro.openweathermap.org/data/2.5/forecast/dailyly?lat='  
  + lat + '&lon=' + lon + 'b6b4200e6e6010fa96be131dbbc2b9eb&cnt=3'

  fetch(fivedayApi)
  .then(function (response) { 
    if (!response.ok) {
      throw response.json();
    }
    return response.json();
  })

  .then(function (data) {
    console.log('data', data);
});
}


function searchApiforlocation(cityName){

  var loccationApi = 'http://api.openweathermap.org/geo/1.0/direct?q=' 
  + cityName + '&limit=1&appid=4d617dbb74fca1df64ec1eb3ec9604f9'

  fetch(loccationApi)
  .then(function (response) { 
    if (!response.ok) {
      throw response.json();
    }
    return response.json();
  })

  .then(function (location) {
  
    var lat = location[0].lat;
    var lon = location[0].lon;
    var name = location[0].name;

    printWeatherCurrent(name ,lat, lon);
    printWeatherFivedays(name ,lat, lon);
  })

  
  
}

function getCityName(event){  

    event.preventDefault();
    var cityName = cityNameEl.val();  

    if (cityName === "") {
        alert('Please enter a city name');
        return;

      } else {
        saveCityToLocalstorage(cityName);
        searchApiforlocation(cityName);
    }
}

PrintCityNames();
cityForm.on('submit', getCityName);  
