import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Lightbulb, Palette, Sun } from "lucide-react";
import { Slider } from "./components/ui/slider";
import { Label } from "@radix-ui/react-label";
import type {
  DeviceName,
  ComponentData as ShineData,
} from "../../ts-shared/types";

const templates = ["lights-on", "lights-off"];

function App() {
  const [shineData, setShineData] = useState({} as ShineData);

  // Fetch device data on component mount
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/get-component-data"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setShineData(data);
    } catch (err) {
      console.error("Error fetching component data:", err);
    }
  };

  const updateShineDataClient = (changes: Partial<ShineData>) => {
    setShineData({ ...shineData, ...changes });
  };

  const updateShineData = async (changes: Partial<ShineData>) => {
    // Send updates to the server
    try {
      const response = await fetch(
        "http://localhost:3000/api/set-component-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changes),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchDevices();
    } catch (err) {
      console.error("Error updating device:", err);
    }
  };

  const applyTemplate = async (templateName: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/apply-template", {
        method: "POST",
        headers: {
          "template-name": templateName,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh device data after applying template
      await fetchDevices();
    } catch (err) {
      console.error("Error applying template:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Lightbulb className="text-yellow-500" />
          Smart Home Lights
        </h1>

        {/* Templates Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Palette className="text-purple-500" />
            Templates
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              {templates.map((template) => (
                <Button
                  onClick={() => applyTemplate(template)}
                  className="w-full"
                  variant="outline"
                  key={template}
                >
                  {template}
                </Button>
              ))}
            </Card>
          </div>
        </div>

        {/* Devices Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Sun className="text-yellow-500" />
            Devices
            <Button
              onClick={fetchDevices}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              Refresh
            </Button>
          </h2>
          {Object.keys(shineData).length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">
                No devices found. Check your connection.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(shineData).map(([name, device]) => (
                <Card key={name} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {name}
                    </h3>
                    <Lightbulb
                      className={`w-6 h-6 ${
                        device.brightness > 0
                          ? "text-yellow-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>

                  {/* Color Preview */}
                  {/* <div
                    className="w-full h-12 rounded-lg mb-4 border-2 border-gray-200"
                    style={{
                      backgroundColor: device.color,
                      opacity: device.brightness / 100,
                    }}
                  /> */}

                  {/* Brightness Slider */}

                  <Label>
                    Brightness {[Math.round(device.brightness * 100)]}%
                  </Label>
                  <Slider
                    key={name}
                    value={[device.brightness * 100]}
                    onValueChange={(v) =>
                      updateShineDataClient({
                        [name]: {
                          brightness: v[0] / 100.0,
                        },
                      })
                    }
                    onClick={(_) => {
                      updateShineData({
                        [name]: {
                          brightness: shineData[name as DeviceName].brightness,
                        },
                      });
                    }}
                  />

                  <Label>Warmth {[Math.round(device.warmth * 100)]}%</Label>
                  <Slider
                    key={name}
                    value={[device.brightness * 100]}
                    onValueChange={(v) =>
                      updateShineDataClient({
                        [name]: {
                          brightness: v[0] / 100.0,
                        },
                      })
                    }
                    onClick={(_) => {
                      updateShineData({
                        [name]: {
                          brightness: shineData[name as DeviceName].brightness,
                        },
                      });
                    }}
                  />

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        updateShineData({ [name]: { brightness: 0 } })
                      }
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Off
                    </Button>

                    <Button
                      onClick={() =>
                        updateShineData({
                          [name]: {
                            brightness: 1,
                          },
                        })
                      }
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Max
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
