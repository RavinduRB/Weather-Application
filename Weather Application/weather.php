<?php
header('Content-Type: application/json');

$apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
$city = $_GET['city'];
$apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
$forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast/daily';

if (empty($city)) {
    echo json_encode(['error' => 'City name is required.']);
    exit;
}

// Handle geolocation requests
if (strpos($city, 'lat=') === 0) {
    $apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' . explode('&lon=', $city)[0] . '&lon=' . explode('&lon=', $city)[1];
    $response = file_get_contents($apiUrl . '&appid=' . $apiKey);
} else {
    $response = file_get_contents($apiUrl . '?q=' . urlencode($city) . '&appid=' . $apiKey . '&units=metric');
}

if ($response === FALSE) {
    echo json_encode(['error' => 'Failed to retrieve data from API.']);
    exit;
}

$data = json_decode($response, true);

if (isset($data['message'])) {
    echo json_encode(['error' => $data['message']]);
    exit;
}

$temperature = $data['main']['temp'];
$unit = 'C';
$forecastResponse = file_get_contents($forecastUrl . '?q=' . urlencode($city) . '&cnt=7&appid=' . $apiKey . '&units=metric');
$forecastData = json_decode($forecastResponse, true);

$forecast = [];
foreach ($forecastData['list'] as $day) {
    $forecast[] = [
        'date' => date('Y-m-d', $day['dt']),
        'condition' => $day['weather'][0]['description'],
        'temperature' => $day['temp']['day']
    ];
}

echo json_encode([
    'city' => $data['name'],
    'temperature' => $temperature,
    'condition' => $data['weather'][0]['description'],
    'humidity' => $data['main']['humidity'],
    'wind_speed' => $data['wind']['speed'],
    'unit' => $unit,
    'forecast' => $forecast
]);
