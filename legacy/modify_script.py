import re

with open('script.js', 'r') as f:
    content = f.read()

# Remove Configuration to Utility (Lines 1 to 494)
# First keep Tab Navigation and Emission Tracker
match = re.search(r'// ===== Tab Navigation =====', content)
if match:
    content = content[match.start():]

# In Tab Navigation, it expects "map" tab to invalidate size. This is fine.
# But "emission-tab" should not be made active again if it's already active by default, though keeping the JS listener is fine.
# Since the initMap() function is called when they click "map", the map works. Wait, is initMap() called on load?
# Let's check if initMap() is called on load. It's usually called at the end of the file.

with open('script.js', 'w') as f:
    f.write(content)
