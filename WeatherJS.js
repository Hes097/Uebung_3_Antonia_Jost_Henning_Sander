        ////////////////////// Location ////////////////////////////////////
        document.querySelector('#findLocation').addEventListener('click', geoLookUp, false)
     
        /**
         * position query
         */
        function geoLookUp() {
            const status = document.querySelector('#status')
            
            /**
             * getting coordinates [lat, lng] according to received position
             * @param {geojson} position
             */
            function success(position) {
                const latitude = position.coords.latitude
                const longitude = position.coords.longitude
                status.textContent = `lat: ${latitude}, lon: ${longitude}`
                setWeather(latitude, longitude)
            }
 
            /**
             * if access is denied: error
             * @param {error-object} err error
             */
            function error(err) {
             status.textContent = 'Unable to retrieve your location. Error: ${err.code}. ${err.message}'
            }
 
            if (!navigator.geolocation) {
                status.textContent = "Geolocation is not supported or allowed by your browser"
            } else {
                status.textContent = "Locating..."
                navigator.geolocation.getCurrentPosition(success, error)
            }
        }
        
        
        //////////////////////////// Weather //////////////////////////
        
        /**
         * sends xmlhttp-request to openweathermap, if correct returns weather information at given position
         * @param {number} latitude 
         * @param {number} longitude 
         */
        function setWeather(latitude, longitude) {
 
         const p = document.querySelector('#weather p')
 
         let openWeatherData = {}
         let xhr = new XMLHttpRequest()
         xhr.open('GET',`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}&units=metric`)
         xhr.responseType = 'text';
 
         xhr.addEventListener('load', function(){
             if (xhr.status === 200){
                 p.textContent = "loading..."
                 openWeatherData = JSON.parse(xhr.responseText)
                 populateWeatherInfo(openWeatherData, p)
             } else {
                 p.textContent = "error: " + xhr.status
             }
         }, false)
 
         xhr.send()
        }
        
        /**
         * transforming openweathermap information into readable information for user
         * @param {geojson} openWeatherData 
         * @param {geojson} p position
         */
         function populateWeatherInfo (openWeatherData, p) {
             //name, temp, windspeed, time
             const location = openWeatherData.name
             const temp = Math.round(openWeatherData.main.temp)
             const feelsLike = Math.round(openWeatherData.main.feels_like)
             const wind = Math.round(openWeatherData.wind.speed)
             const time = new Date(openWeatherData.dt * 1000)        //transforming Date, as saved in Milliseconds
             const hrs = time.getHours()
             const mins = time.getMinutes()
 
             const str = `${location}    ${temp}&#0176C; <br> feels like: ${feelsLike}&#0176C; <br>
             Windspeed: ${wind} km/h<br> Time: ${hrs}:${mins}`
             p.innerHTML = str
 
         }
 
    