#include <WiFi.h>
#include <HTTPClient.h>

// --- WiFi Credentials --- 
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// --- Backend Configuration ---
// Update this with your actual laptop IP if it changes
const char* serverUrl = "http://10.64.138.175:5000/api/device/data";

// --- Device Configuration ---
const String deviceId = "ESP32_Node_01";

// Setup function runs once
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n==================================");
  Serial.println("CHITTI 4.0 - ESP32 Sensor Node");
  Serial.println("==================================");

  // Connect to WiFi
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    Serial.print("ESP32 IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi Connection Failed! Please check credentials.");
  }
}

// Loop function runs repeatedly
void loop() {
  // Only attempt to send if WiFi is connected
  if (WiFi.status() == WL_CONNECTED) {
    sendSensorData();
  } else {
    Serial.println("WiFi disconnected. Reconnecting...");
    WiFi.disconnect();
    WiFi.reconnect();
  }

  // Wait 10 seconds before next reading
  delay(10000);
}

// Function to simulate sensor reading and send data
void sendSensorData() {
  // 1. Simulate reading sensor data
  float temperature = random(200, 350) / 10.0; // 20.0 to 35.0 C
  float humidity = random(400, 800) / 10.0;    // 40.0 to 80.0 %
  float battery = random(800, 1000) / 10.0;    // 80.0 to 100.0 %
  float solarVoltage = random(100, 140) / 10.0; // 10.0 to 14.0 V
  
  // Randomly trigger intrusion events (10% chance)
  bool intrusion = random(0, 10) == 0;
  bool pir = intrusion;
  bool ultrasonic = intrusion ? (random(0, 2) == 0) : false;
  bool vibration = intrusion ? (random(0, 2) == 0) : false;
  
  // Actuators respond to intrusion
  bool buzzer = intrusion;
  bool led = intrusion;
  bool motor = intrusion;

  // 2. Prepare JSON payload manually (or use ArduinoJson library)
  String jsonPayload = "{";
  jsonPayload += "\"deviceId\": \"" + deviceId + "\",";
  jsonPayload += "\"temperature\": " + String(temperature) + ",";
  jsonPayload += "\"humidity\": " + String(humidity) + ",";
  jsonPayload += "\"battery\": " + String(battery) + ",";
  jsonPayload += "\"solarVoltage\": " + String(solarVoltage) + ",";
  jsonPayload += "\"pir\": " + (pir ? "true" : "false") + ",";
  jsonPayload += "\"ultrasonic\": " + (ultrasonic ? "true" : "false") + ",";
  jsonPayload += "\"vibration\": " + (vibration ? "true" : "false") + ",";
  jsonPayload += "\"buzzer\": " + (buzzer ? "true" : "false") + ",";
  jsonPayload += "\"led\": " + (led ? "true" : "false") + ",";
  jsonPayload += "\"motor\": " + (motor ? "true" : "false");
  jsonPayload += "}";

  Serial.println("\n--- Sending Data ---");
  Serial.println("Target URL: " + String(serverUrl));
  Serial.println("Payload: " + jsonPayload);

  // 3. Setup HTTP Client
  HTTPClient http;
  http.begin(serverUrl);
  
  // Important: Specify Content-Type as application/json
  http.addHeader("Content-Type", "application/json");

  // 4. Send POST request
  int httpResponseCode = http.POST(jsonPayload);

  // 5. Handle Response
  if (httpResponseCode > 0) {
    Serial.print("Backend Connected. HTTP Response Code: ");
    Serial.println(httpResponseCode);
    
    String responseBody = http.getString();
    Serial.println("Response Body: ");
    Serial.println(responseBody);
  } else {
    Serial.print("Error sending POST request. Error code: ");
    Serial.println(httpResponseCode);
    Serial.println("Common error codes:");
    Serial.println("-1 : Connection refused (Check Backend IP, Port, Firewall, Router AP Isolation)");
    Serial.println("-11: Connection Timeout");
  }

  // 6. Clean up
  http.end();
}
