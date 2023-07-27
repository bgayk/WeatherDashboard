var root = document.getElementById("root");
var tbl = $("#tbl");
var tbody = $("#tbody");    

const weatherForecast = {
    city: "",
    currentDate:  "",
    currentConditions: "",
    currentConditionDesc: "",
    currentTemp: "",
    currentWindSpeed: "",
    currentHumidity: "",
    futureDays: []
}


// Location Code
// Navigator Options
const options = {
    enableHighAccuracy: true,
    timeout: 10000,
};

// Global Variable to store the user's location
var userLocation = {
    lat: 0,
    long: 0
};

const sucessCallback = (position) => { 
    userLocation.lat = position.coords.latitude;
    userLocation.long = position.coords.longitude;    

    // Get the weather for the user's location
    getWeather(userLocation.lat, userLocation.long);
};

const errorCallback = (error) => {
    console.log(error);
};

const sucessWatchCallback = (position) => { 
    console.log(`Watch: \n` + position);
};

const errorWatchCallback = (error) => {
    console.log(`Watch: \n` + error);
};

function startLocationWatch() {
    var locID = navigator.geolocation.watchPosition(sucessWatchCallback, errorWatchCallback, options);
    return locID;
}; // Only use this if the app needs to track the user's location and the app needs to be real time. i.e. mobile app

function stopLocationWatch() {
    navigator.geolocation.clearWatch(locID);
    return locID;
};
// Location Code <<<<<

// Open Weather API Code >>>>>

// test value for url: https://api.openweathermap.org/data/2.5/forecast?lat=33.2201984&lon=-117.374976&appid=c8026642b8e72e68e954c2b963ed395e
function getWeather(lat,long) {
    var weather = weatherForecast;
    
    var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=c8026642b8e72e68e954c2b963ed395e&units=imperial&cnt=6&mode=json";
    // Current Weather API Call
    fetch(url,               
        {
            method: 'GET',
            mode: 'cors'
        })
        .then((response) => {
            if (response.status == 200) {   // *** This can be just `if (response.ok) {`
                return response.json();
            }
            else
            {
                throw `error with status ${response.status}`;
            }
        })
        .then(body => {               // *** This is where you want to log the response
            weather.city = body.name;                                    
            weather.currentDate = "";  
            weather.currentConditions = body.weather[0].main;
            weather.currentConditionDesc = body.weather[0].description;
            weather.currentTemp = body.main.temp;
            weather.currentWindSpeed = body.wind.speed
            weather.currentHumidity =  body.main.humidity;
        })                                  
        .catch((exception) => {
            console.log(exception);
        });    

    // Forecasted Weather API Call
    url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&appid=c8026642b8e72e68e954c2b963ed395e&units=imperial&mode=json";
    fetch(url,               
        {
            method: 'GET',
            mode: 'cors'
        })
        .then((response) => {
            if (response.status == 200) {    
                return response.json();
            }
            else
            {
                throw `error with status ${response.status}`;
            }
        })
        .then(body => {                                         
            var j = 2; // start at 2 to grab the Noon forecast for the day                       
            for(i=1; i < body.list.length || i < 6; i++) {
                weather.futureDays.push({date: body.list[j].dt_txt, 
                                         conditions: body.list[j].weather[0].main,
                                         conditionDesc: body.list[j].weather[0].description,
                                         temp: body.list[j].main.temp,
                                         windSpeed: body.list[j].wind.speed,
                                         humidity: body.list[j].main.humidity});                                                    
                j = j + 8; // 8 is the number of 3 hour blocks for the day
                if (j > body.list.length){break};
            }
            console.log(weather);
        })                                  
        .catch((exception) => {
            console.log(exception);
        }); 

        // Paginate weather data

};
// Open Weather API Code <<<<<

// Get the User's Location at load time. This requires the user to allow location tracking.
navigator.geolocation.getCurrentPosition(sucessCallback, errorCallback, options); // Requires the users permission to get location;


