import os

file_path = "components/EmissionCalculator.tsx"

with open(file_path, "r") as f:
    content = f.read()

replacements = {
    # Greens
    "'#00e676'": "'var(--accent-green)'",
    "rgba(0, 230, 118,": "rgba(0, 200, 150,",
    "rgba(0,230,118,": "rgba(0, 200, 150,",
    "#69f0ae": "var(--accent-green)",
    
    # Reds
    "'#ff1744'": "'var(--severity-critical)'",
    "rgba(255, 23, 68,": "rgba(255, 69, 58,",
    "rgba(255,23,68,": "rgba(255, 69, 58,",
    "#ff5252": "var(--severity-critical)",
    
    # Oranges/Yellows
    "'#ffab00'": "'var(--severity-high)'",
    "rgba(255, 171, 0,": "rgba(255, 159, 10,",
    "rgba(255,171,0,": "rgba(255, 159, 10,",
    
    # Purples/Blues
    "'#7c4dff'": "'var(--accent-blue)'",
    "'#00b0ff'": "'var(--accent-cyan)'",
    
    # General UI
    "rgba(255,255,255,0.05)": "var(--glass-bg)",
    "rgba(255, 255, 255, 0.05)": "var(--glass-bg)",
    "rgba(255,255,255,0.1)": "var(--glass-border)",
    "rgba(255, 255, 255, 0.1)": "var(--glass-border)",
    "rgba(0,0,0,0.2)": "rgba(0,0,0,0.4)",
    "rgba(255,255,255,0.08)": "rgba(255,255,255,0.04)",
    "'#fff'": "'var(--text-primary)'",
    "'#000'": "'var(--bg-dark)'"
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, "w") as f:
    f.write(content)

print("Colors updated in EmissionCalculator.tsx")
