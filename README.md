# Shine Backend

## API Endpoints

| Endpoint | Type | Parameters | Body | Response | Description |
| --- | --- | --- | --- | --- | --- |
| /get-component-data | GET | component-id: number (exclude to get data on all components) | - | {componentId: int, data: int[]}[] | Gets data on one or all components |
| /update-component-data | POST | - | {componentId: number, data: int[]}[] | - | Updates data on one or more components |