#include <Arduino.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>

// // Replace with your Wi-Fi credentials
const char* ssid = "sexybeavers";
const char* password = "supersecretpassword";

#define COOL_PIN 21
#define WARM_PIN 15

// // API endpoint
const char* apiUrl =
    "http://localhost:3000/api/get-component-data?componentkey=ring-light";

void setup() {
    pinMode(COOL_PIN, OUTPUT);
    pinMode(WARM_PIN, OUTPUT);

    analogWrite(COOL_PIN, 0);
    analogWrite(WARM_PIN, 0);

    Serial.begin(115200);
    // while (!Serial) continue;

    // Connect to Wi-Fi
    Serial.print("Connecting to Wi-Fi");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println();
    Serial.print("Connected! IP address: ");
    Serial.println(WiFi.localIP());
}

void loop() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(apiUrl);  // Specify API URL

        int httpResponseCode = http.GET();
        if (httpResponseCode > 0) {
            String payload = http.getString();
            Serial.println("Response:");
            Serial.println(payload);

            JsonDocument doc;
            DeserializationError error = deserializeJson(doc, payload);
            if (!error) {
                const bool cool = doc["cool"].as<bool>();
                const bool warm = doc["warm"].as<bool>();
                Serial.print("Value: ");
                Serial.print(cool);
                Serial.print(" ");
                Serial.println(warm);

                digitalWrite(COOL_PIN, cool ? HIGH : LOW);
                digitalWrite(WARM_PIN, cool ? HIGH : LOW);
            } else {
                Serial.print("JSON parse error: ");
                Serial.println(error.c_str());
            }
        } else {
            Serial.print("Error on HTTP request: ");
            Serial.println(httpResponseCode);
        }

        http.end();
    } else {
        Serial.println("Wi-Fi disconnected, retrying...");
    }

    delay(300);

    // digitalWrite(LED_PIN, LOW);
    // Serial.println("STARTING CYCLE");

    // analogWrite(LED_PIN, 0);

    // delay(2000);
    // analogWrite(LED_PIN, 3);

    // delay(2000);
    // analogWrite(LED_PIN, 5);

    // delay(2000);
    // analogWrite(LED_PIN, 7);

    // delay(2000);
}
