#include "status-sync.h"

StatusSync::StatusSync(String endpointUrl, uint fetchInterval)
    : endpointUrl(endpointUrl), fetchInterval(fetchInterval) {}

std::optional<JsonDocument> StatusSync::update() {
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
}