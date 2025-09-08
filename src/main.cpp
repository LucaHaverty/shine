#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>  // Optional, for parsing JSON easily

// Replace with your Wi-Fi credentials
const char* ssid = "Ivonhouse2";
const char* password = "eamonlucarule.22";

#define LED_PIN 32

// API endpoint
const char* apiUrl =
    "https://improvements-deleted-supported-refurbished.trycloudflare.com/api/"
    "light";

void setup() {
    pinMode(LED_PIN, OUTPUT);
    // TODO: starts on
    digitalWrite(LED_PIN, HIGH);

    Serial.begin(115200);
    while (!Serial) continue;

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

            // Optional: parse JSON using ArduinoJson

            JsonDocument doc;
            DeserializationError error = deserializeJson(doc, payload);
            if (!error) {
                const bool value = doc["light"].as<bool>();
                Serial.print("Value: ");
                Serial.println(value);

                digitalWrite(LED_PIN, value ? HIGH : LOW);
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

    delay(300);  // Wait 5 seconds before next request
}
