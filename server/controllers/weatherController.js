const axios = require('axios');

// @desc    Get weather for a specific city
// @route   GET /api/weather/:city
// @access  Public (Farmers need this easily!)
exports.getWeather = async (req, res) => {
  const city = req.params.city;
  const apiKey = '024e10d253a2af887c0cc4ea752926d8'; // <--- PASTE YOUR KEY HERE!
  
  // We use the metric unit to get Celsius (not Fahrenheit)
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    // We select only what the farmer needs
    const weatherData = {
      city: data.name,
      temperature: data.main.temp + "°C",
      condition: data.weather[0].description,
      humidity: data.main.humidity + "%",
      windSpeed: data.wind.speed + " m/s"
    };

    res.status(200).json({
      success: true,
      data: weatherData
    });

  } catch (error) {
    // Add this line to see the real reason in your VS Code Terminal:
    console.log("Weather Error:", error.response ? error.response.data : error.message);
    
    res.status(500).json({ 
      success: false, 
      message: "Could not fetch weather. Check terminal for details." 
    });
}
};