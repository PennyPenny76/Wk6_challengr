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
      city.addClass("btn btn-grey");
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
  cityTodayName.text("");
  $('#weather-today').empty();
  $('.icon').remove();

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
    
    var date = dayjs();

    var iconImg = 'https://openweathermap.org/img/wn/'+ data.weather[0].icon +'@2x.png';
    var icon = $('<img>');
    icon.attr({
    src: iconImg,
    alt: data.weather[0].description});
    icon.addClass('icon icon-today')

    var temp = data.main.temp;
    var wind = data.wind.speed;
    var humidity = data.main.humidity;

    var tempEl = $("<li>");
    tempEl.text('Temp: ' + temp + ' °F');
    var windEl = $("<li>");
    windEl.text('Wind: ' + wind + ' MPH');
    var humidityEl = $("<li>");
    humidityEl.text('Humidity: ' + humidity + ' %');

    $('.city-today-header').append(icon);
    cityTodayName.text(name + '(' + date.format('MMM D, YYYY') + ')');
    $('#weather-today').append(tempEl, windEl, humidityEl );
    $('#city-today').addClass('city-today-border');
    
  })
}

function printWeatherFivedays(name ,lat, lon){
  $('#5day-cards').empty();
  $('.5day-header').text('5-Day Forecast:');

  var fivedayApi = 'https://api.openweathermap.org/data/2.5/forecast?lat='  
  + lat + '&lon=' + lon + '&appid=b6b4200e6e6010fa96be131dbbc2b9eb'

  fetch(fivedayApi)
  .then(function (response) { 
    if (!response.ok) {
      throw response.json();
    }
    return response.json();
  })

  .then(function (data) {
    
    var i=1;
    var j=i*8-1;

    for ( i = 1; i < 6; i++) {
      $('.5day-header').text('5-Day Forecast:');

      var cards = $('<card>');
      cards.addClass('card five-cards col-12 col-md-2');
      cards.attr('id',i);
      $('#5day-cards').append(cards);

      var dateElFive = $("<p>");
      dateElFive.attr('id','date-five-header')
      dateElFive.text(data.list[j].dt_txt);
      
      var fiveIconImg = 'https://openweathermap.org/img/wn/'+ data.list[j].weather[0].icon +'@2x.png';
      var fiveIcon = $('<img>');
      fiveIcon.attr({
      src: fiveIconImg,
      alt: data.list[j].weather[0].description});
      fiveIcon.addClass('icon icon-fiveday')

      var tempElFive = $("<p>");
      tempElFive.text('Temp: ' + data.list[j].main.temp + ' °F');
      var windElFive = $("<p>");
      windElFive.text('Wind: ' + data.list[j].wind.speed + ' MPH');
      var humidityElFive = $("<p>");
      humidityElFive.text('Humidity: ' + data.list[j].main.humidity + ' %');

      // var cardId = cards.attr('id');

      // console.log('cardId',cardId)
      // console.log('i',i)
      // if (cardId === i){
        cards.append(dateElFive, fiveIcon, tempElFive, windElFive, humidityElFive);
      // }
    }

    
});
}


function searchApiforlocation(cityName){

  var locationApi = 'http://api.openweathermap.org/geo/1.0/direct?q=' 
  + cityName + '&limit=1&appid=4d617dbb74fca1df64ec1eb3ec9604f9'

  fetch(locationApi)
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

cityListEl.on('click', ".btn-grey", function (event){
  var cityName = $(event.target).attr('id');
  searchApiforlocation(cityName);
}
);
