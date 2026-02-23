# AirWatch - Real-Time Air Quality Monitoring

**ASEP Group 11 Project**

A modern, premium pollution monitoring website that tracks Air Quality Index (AQI) and major pollutants for any location worldwide.

![AirWatch Demo](https://img.shields.io/badge/Status-Production%20Ready-success)
![API](https://img.shields.io/badge/API-OpenWeatherMap-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🌍 **Global Coverage**: Search any city worldwide
- 📊 **Real-Time Data**: Live AQI and pollutant tracking via OpenWeatherMap API
- 🎨 **Modern UI**: Dark mode with glassmorphism effects
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🔍 **8 Major Pollutants**: PM2.5, PM10, NO₂, SO₂, O₃, CO, NH₃, NO
- 💡 **Health Recommendations**: Dynamic advice based on air quality
- 📈 **Data Visualization**: Interactive charts powered by Chart.js
- 📍 **Geolocation**: One-click current location detection

## 🚀 Quick Start

1. **Clone or Download** this repository
2. **Open** `index.html` in any modern web browser
3. **Search** for a city or use your current location
4. **View** real-time air quality data and health recommendations

No build process or dependencies required - just open and use!

## 🔑 API Key

The project includes a demo API key for OpenWeatherMap. For production use:

1. Get your free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Replace the `API_KEY` in `script.js` (line 2)

```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
```

## 📖 How to Use

1. **Search by City Name**: Type any city (e.g., "Mumbai", "London", "New York") and press Enter
2. **Use Current Location**: Click the location icon button
3. **View Results**: See AQI, pollutant levels, health recommendations, and charts

## 🎨 Design Features

- **Glassmorphism**: Frosted glass effect on all cards
- **Color-Coded AQI**: 6-level scale from Good (green) to Severe (purple)
- **Smooth Animations**: Fade-in effects and hover transitions
- **Vibrant Gradients**: Dynamic background with particle effects
- **Modern Typography**: Inter and Outfit fonts from Google Fonts

## 📊 AQI Categories

| AQI | Category | Color | Health Impact |
|-----|----------|-------|---------------|
| 1 | Good | Green | Air quality is excellent |
| 2 | Fair | Light Green | Acceptable for most people |
| 3 | Moderate | Yellow | Sensitive groups may be affected |
| 4 | Poor | Orange | Everyone may experience effects |
| 5 | Very Poor | Red | Health alert - serious effects |
| 6 | Severe | Purple | Emergency conditions |

## 🛠️ Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with custom properties
- **JavaScript (ES6+)**: Async/await, Fetch API
- **Chart.js**: Data visualization
- **OpenWeatherMap API**: Real-time pollution data
- **Google Fonts**: Inter and Outfit

## 📁 Project Structure

```
asep_project/
├── index.html          # Main HTML structure
├── style.css           # Styles and design system
├── script.js           # JavaScript logic and API integration
└── README.md           # This file
```

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📱 Responsive Breakpoints

- **Desktop**: Full layout (1200px+)
- **Tablet**: Optimized grid (768px - 1199px)
- **Mobile**: Single column (< 768px)

## 🔮 Future Enhancements

- Historical data trends
- Air quality forecasts
- Multiple location comparison
- Favorite locations storage
- Push notifications
- Social sharing

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Credits

- **Project**: ASEP Group 11
- Air quality data: [OpenWeatherMap](https://openweathermap.org/)
- Standards: WHO Air Quality Guidelines
- Design inspiration: Modern web design trends

## 📧 Support

For issues or questions, please open an issue on the repository.

---

**Made with ❤️ by ASEP Group 11 for cleaner air awareness**
