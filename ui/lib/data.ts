// Simulated sensor data for the hydraulic system
export interface SensorData {
    timestamp: string;
    // Pressure sensors (bar)
    PS1: number;
    PS2: number;
    PS3: number;
    PS4: number;
    PS5: number;
    PS6: number;
    // Motor power (W)
    EPS1: number;
    // Volume flow (l/min)
    FS1: number;
    FS2: number;
    // Temperature sensors (°C)
    TS1: number;
    TS2: number;
    TS3: number;
    TS4: number;
    // Vibration (mm/s)
    VS1: number;
    // Cooling efficiency (%)
    CE: number;
    // Cooling power (kW)
    CP: number;
}

export interface SystemCondition {
    coolerCondition: 3 | 20 | 100;
    valveCondition: 73 | 80 | 90 | 100;
    pumpLeakage: 0 | 1 | 2;
    accumulatorPressure: 90 | 100 | 115 | 130;
}

// Generate mock historical data
export function generateHistoricalData(points: number = 24): SensorData[] {
    const data: SensorData[] = [];
    const now = new Date();

    for (let i = points - 1; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 3600000);
        data.push({
            timestamp: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            PS1: 150 + Math.random() * 20 - 10,
            PS2: 120 + Math.random() * 15 - 7.5,
            PS3: 100 + Math.random() * 10 - 5,
            PS4: 80 + Math.random() * 8 - 4,
            PS5: 60 + Math.random() * 6 - 3,
            PS6: 40 + Math.random() * 4 - 2,
            EPS1: 2500 + Math.random() * 200 - 100,
            FS1: 10 + Math.random() * 2 - 1,
            FS2: 8 + Math.random() * 1.5 - 0.75,
            TS1: 45 + Math.random() * 5 - 2.5,
            TS2: 42 + Math.random() * 4 - 2,
            TS3: 38 + Math.random() * 3 - 1.5,
            TS4: 35 + Math.random() * 3 - 1.5,
            VS1: 0.5 + Math.random() * 0.3 - 0.15,
            CE: 85 + Math.random() * 10 - 5,
            CP: 3.5 + Math.random() * 0.5 - 0.25,
        });
    }

    return data;
}

// Get current sensor readings
export function getCurrentSensorData(): SensorData {
    return {
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        PS1: 155.3,
        PS2: 118.7,
        PS3: 98.2,
        PS4: 82.1,
        PS5: 61.5,
        PS6: 41.2,
        EPS1: 2480,
        FS1: 10.5,
        FS2: 8.2,
        TS1: 46.3,
        TS2: 43.1,
        TS3: 38.8,
        TS4: 35.2,
        VS1: 0.52,
        CE: 87.5,
        CP: 3.6,
    };
}

// Get current system condition (simulated prediction results)
export function getSystemCondition(): SystemCondition {
    return {
        coolerCondition: 100,
        valveCondition: 90,
        pumpLeakage: 0,
        accumulatorPressure: 130,
    };
}

// Helper functions for condition descriptions
export function getCoolerConditionInfo(value: number): { label: string; color: string; description: string } {
    switch (value) {
        case 3:
            return { label: 'Critical', color: 'destructive', description: 'Close to total failure' };
        case 20:
            return { label: 'Warning', color: 'warning', description: 'Reduced efficiency' };
        case 100:
            return { label: 'Optimal', color: 'success', description: 'Full efficiency' };
        default:
            return { label: 'Unknown', color: 'secondary', description: 'Unknown status' };
    }
}

export function getValveConditionInfo(value: number): { label: string; color: string; description: string } {
    switch (value) {
        case 73:
            return { label: 'Critical', color: 'destructive', description: 'Close to total failure' };
        case 80:
            return { label: 'Poor', color: 'destructive', description: 'Severe lag' };
        case 90:
            return { label: 'Warning', color: 'warning', description: 'Small lag' };
        case 100:
            return { label: 'Optimal', color: 'success', description: 'Optimal switching behavior' };
        default:
            return { label: 'Unknown', color: 'secondary', description: 'Unknown status' };
    }
}

export function getPumpLeakageInfo(value: number): { label: string; color: string; description: string } {
    switch (value) {
        case 0:
            return { label: 'Optimal', color: 'success', description: 'No leakage detected' };
        case 1:
            return { label: 'Warning', color: 'warning', description: 'Weak leakage detected' };
        case 2:
            return { label: 'Critical', color: 'destructive', description: 'Severe leakage detected' };
        default:
            return { label: 'Unknown', color: 'secondary', description: 'Unknown status' };
    }
}

export function getAccumulatorInfo(value: number): { label: string; color: string; description: string } {
    switch (value) {
        case 90:
            return { label: 'Critical', color: 'destructive', description: 'Close to total failure' };
        case 100:
            return { label: 'Poor', color: 'destructive', description: 'Severely reduced pressure' };
        case 115:
            return { label: 'Warning', color: 'warning', description: 'Slightly reduced pressure' };
        case 130:
            return { label: 'Optimal', color: 'success', description: 'Optimal pressure' };
        default:
            return { label: 'Unknown', color: 'secondary', description: 'Unknown status' };
    }
}
