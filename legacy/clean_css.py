import re

with open('style.css', 'r') as f:
    content = f.read()

# Remove sections from style.css
sections_to_remove = [
    r'/\* ===== Search Section ===== \*/.*?(?=/\* =====)',
    r'/\* ===== Monitor Landing ===== \*/.*?(?=/\* =====)',
    r'/\* ===== Loading & Error ===== \*/.*?(?=/\* =====)',
    r'/\* ===== Info Row \(Location \+ Weather\) ===== \*/.*?(?=/\* =====)',
    r'/\* ===== Location Info ===== \*/.*?(?=/\* =====)',
    r'/\* ===== Weather Card ===== \*/.*?(?=/\* =====)',
    r'/\* ===== AQI Display ===== \*/.*?(?=/\* =====)',
    r'/\* ===== Pollutants ===== \*/.*?(?=/\* =====)',
    r'/\* ===== Health Section ===== \*/.*?(?=/\* =====)',
    r'/\* ===== Chart Section ===== \*/.*?(?=/\* =====)'
]

for pattern in sections_to_remove:
    content = re.sub(pattern, '', content, flags=re.DOTALL)

with open('style.css', 'w') as f:
    f.write(content)
