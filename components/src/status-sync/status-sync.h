// #pragma once

// #include <Arduino.h>
// #include <optional>
// #include <HTTPClient.h>
// #include <ArduinoJson.h>

// class StatusSync {
//    private:
//     String endpointUrl;
//     String lastData;

//     uint lastFetch;
//     uint fetchInterval;

//    public:
//     StatusSync(String endpointUrl, uint fetchInterval);

//     std::optional<JsonDocument> update();
// };