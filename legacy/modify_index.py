import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. Metadata
content = content.replace(
    'content="Real-time air quality monitoring with AQI tracking, pollutant analysis and Indian motor vehicle policies"',
    'content="Vehicle emission tracking, daily CO₂ footprint estimation and Indian motor vehicle policies"'
)
content = content.replace(
    'content="air quality, AQI, pollution, PM2.5, environmental monitoring, India"',
    'content="vehicle emission, CO2, pollution, PM2.5, environmental monitoring, India"'
)
content = content.replace(
    '<title>AirWatch - Real-Time Air Quality Monitoring</title>',
    '<title>Emmision-Sense - Vehicle Emission Tracker</title>'
)

# 2. Header text
content = content.replace('<h1>AirWatch</h1>', '<h1>Emmision-Sense</h1>')
content = content.replace(
    '<p class="tagline">Real-Time Air Quality & Motor Vehicle Compliance</p>',
    '<p class="tagline">Check your vehicle\'s pollution emission</p>'
)

# 3. Nav tabs
content = re.sub(
    r'<button class="nav-btn active" data-tab="monitor">.*?Monitor\s*</button>\s*<button class="nav-btn" data-tab="emission">',
    '<button class="nav-btn active" data-tab="emission">',
    content,
    flags=re.DOTALL
)

# 4. Remove Loading, Error, Monitor tabs
content = re.sub(
    r'<!-- Loading State -->.*?<!-- Tab: Emission Tracker -->\s*<section id="emission-tab" class="tab-content">',
    '<!-- Tab: Emission Tracker -->\n            <section id="emission-tab" class="tab-content active">',
    content,
    flags=re.DOTALL
)

# 5. Footer text
content = content.replace('<strong>AirWatch</strong>', '<strong>Emmision-Sense</strong>')
content = content.replace(
    '<p class="footer-note">Data: OpenWeatherMap API · Standards: CPCB India / WHO Guidelines</p>',
    '<p class="footer-note">Standards: CPCB India / WHO Guidelines</p>'
)

# 6. Remove Chart.js
content = re.sub(r'<!-- Chart\.js for data visualization -->.*?<script src="https://cdn\.jsdelivr\.net/npm/chart\.js.*?</script>\s*', '', content, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(content)
