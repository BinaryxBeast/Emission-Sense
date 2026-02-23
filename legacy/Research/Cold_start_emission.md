# Cold Start Emission Multipliers\n\nThis document contains data parameters and properties for related modeling logic.\n\n## Source Data\n```json\n{
"definition": {
"description": "Indicative cold-start emission multipliers F_cold_p(T, L_trip) = E_total / E_hot for different ambient temperature bands and trip lengths. Values are synthesized from EMEP/EEA (COPERT) cold-excess concepts and field/dynamometer studies; they are suitable as defaults in a web tool but not a substitute for full COPERT/MOVES tables.",

"base_formula": "E_p,trip = E_p,hot_trip * F_cold_p(T_amb, L_trip_km)",
"trip_length_definitions_km": {
"short_trip": "≈2–4 km (trip distance smaller than typical cold distance; engine and catalyst not fully warm).",

"long_trip": "≈10–15 km (trip distance similar to or greater than COPERT/EMEP/EEA reference l_trip ≈ 12 km; engine mostly warm for majority of distance)."

},
"notes": "Multipliers are larger for CO and VOC than for NOx and CO2, and generally larger for gasoline (SI) than for diesel (CI) vehicles. Use separate warm/hot emission factors by technology and fuel where available."

},
"temperature_bands_C": [
">= 20",
"10 to <20",
"0 to <10",
"<0 (≈ -7 to -10)"
],
"multipliers": [
{
"vehicle_type": "gasoline_passenger_car_Euro5_6",
"pollutant_group": "CO_and_VOC",
"ambient_temp_band_C": ">= 20",
"trip_type": "short_3km",
"multiplier_range": [1.2, 1.6],
"interpretation": "On a short 2–4 km trip at warm temperatures ~20–25 °C, total trip CO/VOC are typically about 20–60% higher than if the engine and catalyst were fully warm for the whole trip.",

"references": [
"",
"",
""
]
},
{
"vehicle_type": "gasoline_passenger_car_Euro5_6",
"pollutant_group": "CO_and_VOC",
"ambient_temp_band_C": ">= 20",
"trip_type": "long_12km",
"multiplier_range": [1.05, 1.20],
"interpretation": "For longer 10–15 km trips at warm conditions, cold-start excess CO/VOC is diluted over distance; total trip emissions are typically 5–20% above fully-hot levels.",

"references": [
"",
""
]
},
{
"vehicle_type": "gasoline_passenger_car_Euro5_6",
"pollutant_group": "CO_and_VOC",
"ambient_temp_band_C": "10 to <20",
"trip_type": "short_3km",
"multiplier_range": [1.5, 2.5],
"interpretation": "At mild cool temperatures (≈10–15 °C), short urban trips often show total CO/VOC 1.5–2.5 times hot-only values, as cold distance extends and catalyst light-off is slower.",

"references": [
"",
"",
""
]
},
{
"vehicle_type": "gasoline_passenger_car_Euro5_6",
"pollutant_group": "CO_and_VOC",
"ambient_temp_band_C": "10 to <20",
"trip_type": "long_12km",
"multiplier_range": [1.1, 1.4],
"interpretation": "For 10–15 km trips in this temperature band, total CO/VOC are roughly 10–40% above fully-hot levels; much of the cycle is warm but the first few km are dominated by cold-start.",

"references": [
"",
""
]
},
{
"vehicle_type": "gasoline_passenger_car_Euro5_6",
"pollutant_group": "CO_and_VOC",
"ambient_temp_band_C": "0 to <10",
"trip_type": "short_3km",
"multiplier_range": [2.0, 3.5],
"interpretation": "Around 0–5 °C, short trips of 2–4 km can have CO/VOC 2–3.5 times hot-only values; several studies report cold-start CO and HC differences of 100–300% versus hot running over short urban cycles.",

"references": [
"",
"",
""
]
},
{
"vehicle_type": "gasoline_passenger_car_Euro5_6",
"pollutant_group": "CO_and_VOC",
"ambient_temp_band_C": "0 to <10",
"trip_type": "long_12km",
"multiplier_range": [1.2, 1.8],
"interpretation": "For 10–15 km trips near 0–5 °C, total CO/VOC are typically 20–80% higher than hot-only values, reflecting an extended cold distance but still a substantial warm portion of the drive.",

"references": [
"",
""
]
},
{
"vehicle_type": "gasoline_passenger_car_Euro5_6",
"pollutant_group": "CO_and_VOC",
"ambient_temp_band_C": "<0 (≈ -7 to -10)",
"trip_type": "short_3km",
"multiplier_range": [3.0, 6.0],
"interpretation": "At −7 to −10 °C, cold-start dominates short trips; measurements show CO and HC cold-start phases can be several times higher than hot phases, with total trip emissions roughly 3–6× hot-only for 2–4 km trips.",

"references": [
"",
"",
""
]
},
{
"vehicle_type": "gasoline_passenger_car_Euro5_6",
"pollutant_group": "CO_and_VOC",
"ambient_temp_band_C": "<0 (≈ -7 to -10)",
"trip_type": "long_12km",
"multiplier_range": [1.5, 2.5],
"interpretation": "For 10–15 km trips at −7 to −10 °C, total CO/VOC are typically 1.5–2.5× higher than hot-only; one Euro 6 cold-temperature study found average emissions over WLTC at −7 °C 2.6× those at 23 °C for key pollutants.",

"references": [
"",
""
]
},
{
"vehicle_type": "gasoline_passenger_car_Euro5_6",
"pollutant_group": "NOx",
"ambient_temp_band_C": ">= 20",
"trip_type": "short_3km",
"multiplier_range": [1.05, 1.3],
"interpretation": "At warm temperatures, short-trip NOx is modestly elevated (≈5–30%) vs hot-only, because NOx is less sensitive to cold-start than CO/HC for gasoline vehicles.",

"references": [
"",
""
]
},
{
"vehicle_type": "gasoline_passenger_car_Euro5_6",
"pollutant_group": "NOx",
"ambient_temp_band_C": "0 to <10",
"trip_type": "short_3km",
"multiplier_range": [1.3, 2.5],
"interpretation": "Near 0–5 °C, short-trip NOx can be 30–150% higher than hot-only values; reviews report NOx start-excess ratios in the range of 1.1–3× depending on technology and cycle.",

"references": [
"",
"",
""
]
},
{
"vehicle_type": "gasoline_passenger_car_Euro5_6",
"pollutant_group": "NOx",
"ambient_temp_band_C": "<0 (≈ -7 to -10)",
"trip_type": "long_12km",
"multiplier_range": [1.3, 2.0],
"interpretation": "For longer trips at −7 °C, cycle-averaged NOx for Euro 6 gasoline cars has been observed up to roughly twice the 23 °C value for some cases, with an average increase around 2.6× across pollutants when comparing −7 vs 23 °C.",
​
"references": [
""
]
},
{
"vehicle_type": "diesel_passenger_car_Euro5_6",
"pollutant_group": "CO_and_VOC",
"ambient_temp_band_C": ">= 10",
"trip_type": "short_3km",
"multiplier_range": [1.1, 1.6],
"interpretation": "Cold-start effects on CO/VOC for modern diesels are generally smaller than for gasoline; short trips may show ≈10–60% increases vs hot-only levels.",

"references": [
"",
"",
""
]
},
{
"vehicle_type": "diesel_passenger_car_Euro5_6",
"pollutant_group": "NOx_and_PM",
"ambient_temp_band_C": "0 to <10",
"trip_type": "short_3km",
"multiplier_range": [1.2, 2.0],
"interpretation": "For Euro 6 diesels, cold-start increases NOx and PM by roughly 20–100% on short urban trips compared to fully warm operation; some studies show several-fold PN increases during the start phase, even though average cycle factors are lower.",

"references": [
"",
"",
""
]
},
{
"vehicle_type": "gasoline_or_diesel_passenger_car",
"pollutant_group": "CO2",
"ambient_temp_band_C": ">= 20",
"trip_type": "short_3km",
"multiplier_range": [1.05, 1.15],
"interpretation": "Cold-start CO2 increases are modest at warm temperatures, typically 5–15% higher total trip CO2 than hot-only, due to richer mixtures and higher friction during warm-up.",

"references": [
"",
""
]
},
{
"vehicle_type": "gasoline_or_diesel_passenger_car",
"pollutant_group": "CO2",
"ambient_temp_band_C": "<0 (≈ -7 to -10)",
"trip_type": "short_3km",
"multiplier_range": [1.1, 1.4],
"interpretation": "At −7 to −10 °C, studies report cold-start CO2 about 110% higher than hot-running rates during the initial phase, translating to roughly 10–40% higher total trip CO2 for typical real-world trips.",

"references": [
"",
"",
""
]
}
],
"implementation_hint": {
"simple_function": "For a high-level web tool, you can interpolate multipliers linearly with temperature within each band and choose between short_trip or long_trip curves based on user trip length L_trip (e.g., use short_trip multipliers if L_trip <= 5 km, long_trip if L_trip >= 8–10 km, and interpolate in between). Then apply E_p,trip = E_p,hot_trip * F_cold_p(T_amb, L_trip_km). For more detail, use COPERT/EMEP/EEA cold-excess ratios eCOLD/eHOT as a function of T_amb and distance since start."

}
}\n```\n\n## Programming Implementation Feature\n\n```typescript\nexport interface ColdStartMultiplier {
    vehicle_type: string;
    pollutant_group: string;
    ambient_temp_band_C: string;
    trip_type: string;
    multiplier_range: [number, number];
    interpretation: string;
    references: string[];
}

export function applyColdStartMultiplier(hotEmission: number, multiplierValue: number): number {
    return hotEmission * multiplierValue;
}\n```\n