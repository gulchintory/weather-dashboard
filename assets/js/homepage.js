var cityFormEl = document.querySelector('#city-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var nameInputEl = document.querySelector('#cityname');
var cityWeatherInfo = document.querySelector('#city-weather-info');
var forecastContainer = document.querySelector('#forecast-5-days');

var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityname = nameInputEl.value.trim();

  if (cityname) {
    getWeather(cityname);

    forecastContainer.textContent = '';
    nameInputEl.value = '';
  } else {
    alert('Please set a valid cityname');
  }
};

var buttonClickHandler = function (event) {
  var cityname = event.target.textContent;

  if (cityname) {
    getWeather(cityname);

    forecastContainer.textContent = '';
  }
};

var getWeather = function (cityname) {
  let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+cityname+'&APPID=df4e5ccbd65431112a67c15ad5696cb1&units=imperial';

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        cityWeatherInfo.innerHTML = '';
        
        response.json().then(function (data) {
          console.log({data});
          var cityinfo= document.createElement('h3');
          let today = new Date().toLocaleDateString();
          cityinfo.textContent = data.name + ' (' + today + ')';
          cityWeatherInfo.appendChild(cityinfo);

          var tempinfo= document.createElement('p');
          tempinfo.textContent = 'Temp: ' + data.main.temp + ' F';
          cityWeatherInfo.appendChild(tempinfo);

          var windinfo= document.createElement('p');
          windinfo.textContent = 'Wind: ' + data.wind.speed +' MPH';
          cityWeatherInfo.appendChild(windinfo);

          var humidityinfo= document.createElement('p');
          humidityinfo.textContent = 'Humidity: ' + data.main.humidity + ' %';
          cityWeatherInfo.appendChild(humidityinfo);

          display5Days(data.coord, cityname);

          var storedCities = localStorage.getItem('cities');
          if (storedCities) {
            var citiesList = JSON.parse(storedCities);
            if (!citiesList.includes(cityname)) {
            citiesList.push(data.name);
            localStorage.setItem('cities',JSON.stringify(citiesList));
            
            var cityButton= document.createElement('button');
            cityButton.classList = 'btn';
            cityButton.textContent = data.name;

            cityButtonsEl.appendChild(cityButton);

            } 
          }
          else {
            var citiesList = [data.name];
            localStorage.setItem('cities',JSON.stringify(citiesList));

            var cityButton= document.createElement('button');
            cityButton.classList = 'btn';
            cityButton.textContent = data.name;

            cityButtonsEl.appendChild(cityButton);
          }

        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
};

var display5Days = function (coord, searchTerm) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&APPID=df4e5ccbd65431112a67c15ad5696cb1&units=imperial`
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
      for (var i = 0; i < 40; i = i+8) {
          var dataEl = data.list[i]

          var forecastDiv = document.createElement('div');
          forecastDiv.classList = 'list-item col-2';

          var dateinfo= document.createElement('h3');
          let today = new Date(dataEl.dt_txt).toLocaleDateString();
          dateinfo.textContent = today;
          forecastDiv.appendChild(dateinfo);

          var tempinfo= document.createElement('p');
          tempinfo.textContent = 'Temp: ' + dataEl.main.temp + ' F';
          forecastDiv.appendChild(tempinfo);

          var windinfo= document.createElement('p');
          windinfo.textContent = 'Wind: ' + dataEl.wind.speed +' MPH';
          forecastDiv.appendChild(windinfo);

          var humidityinfo= document.createElement('p');
          humidityinfo.textContent = 'Humidity: ' + dataEl.main.humidity + ' %';
          forecastDiv.appendChild(humidityinfo);


          forecastContainer.appendChild(forecastDiv);
      }
      
    });
    
  });
};

function fillStoredCities () {
  var storedCities = localStorage.getItem('cities');
  if (storedCities) {
    var citiesList = JSON.parse(storedCities);
    if (citiesList.length > 0) {
      for (let index = 0; index < citiesList.length; index++) {
        const element = citiesList[index];

        var cityButton= document.createElement('button');
        cityButton.classList = 'btn';
        cityButton.textContent = element;
  
        cityButtonsEl.appendChild(cityButton);
        
      }
    } 
  } 
}

cityFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);
fillStoredCities();
