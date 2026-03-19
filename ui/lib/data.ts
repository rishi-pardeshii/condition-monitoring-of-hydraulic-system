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
    // System efficiency (%)
    SE: number;
}

export interface SystemCondition {
    coolerCondition: 3 | 20 | 100;
    valveCondition: 73 | 80 | 90 | 100;
    pumpLeakage: 0 | 1 | 2;
    accumulatorPressure: 90 | 100 | 115 | 130;
}

// Generate mock historical data
// Seeded noise helper — smooth pseudo-random walk
function smoothNoise(t: number, freq: number, phase: number): number {
    return (
        Math.sin(t * freq + phase) * 0.5 +
        Math.sin(t * freq * 2.3 + phase * 1.7) * 0.3 +
        Math.sin(t * freq * 5.1 + phase * 0.9) * 0.2
    );
}

interface SensorConfig {
    min: number;
    max: number;
    freq: number;   // oscillation frequency (radians/hour)
    phase: number;  // phase offset so each sensor is independent
    noiseAmp: number; // 0–1, fraction of range that's "jitter"
}

const SENSOR_CONFIG: Record<keyof Omit<SensorData, 'timestamp'>, SensorConfig> = {
    PS1:  { min: 155.39, max: 180.92, freq: 0.4,  phase: 0.0,  noiseAmp: 0.08 },
    PS2:  { min: 104.41, max: 131.59, freq: 0.3,  phase: 1.2,  noiseAmp: 0.10 },
    PS3:  { min: 0.84,   max: 2.02,   freq: 0.6,  phase: 2.4,  noiseAmp: 0.12 },
    PS4:  { min: 0.0,    max: 10.21,  freq: 0.25, phase: 0.8,  noiseAmp: 0.20 },
    PS5:  { min: 8.37,   max: 9.98,   freq: 0.5,  phase: 3.1,  noiseAmp: 0.06 },
    PS6:  { min: 8.32,   max: 9.86,   freq: 0.5,  phase: 4.2,  noiseAmp: 0.06 },
    TS1:  { min: 35.31,  max: 57.90,  freq: 0.2,  phase: 1.0,  noiseAmp: 0.05 },
    TS2:  { min: 40.86,  max: 61.96,  freq: 0.2,  phase: 2.0,  noiseAmp: 0.05 },
    TS3:  { min: 38.25,  max: 59.42,  freq: 0.2,  phase: 3.0,  noiseAmp: 0.05 },
    TS4:  { min: 30.39,  max: 53.06,  freq: 0.2,  phase: 4.0,  noiseAmp: 0.05 },
    FS1:  { min: 2.02,   max: 6.72,   freq: 0.35, phase: 0.5,  noiseAmp: 0.15 },
    FS2:  { min: 8.86,   max: 10.40,  freq: 0.35, phase: 1.5,  noiseAmp: 0.08 },
    EPS1: { min: 2361.7, max: 2740.6, freq: 0.15, phase: 2.5,  noiseAmp: 0.07 },
    VS1:  { min: 0.524,  max: 0.839,  freq: 0.45, phase: 0.3,  noiseAmp: 0.10 },
    CE:   { min: 17.56,  max: 47.90,  freq: 0.28, phase: 1.8,  noiseAmp: 0.18 },
    CP:   { min: 1.062,  max: 2.840,  freq: 0.28, phase: 2.8,  noiseAmp: 0.12 },
    SE:   { min: 18.28,  max: 60.76,  freq: 0.22, phase: 0.6,  noiseAmp: 0.18 },
};

export function generateHistoricalData(points: number = 24): SensorData[] {
    const data: SensorData[] = [];
    const now = new Date();

    for (let i = points - 1; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 3600000);
        const t = (points - 1 - i); // time index: 0 = oldest, grows forward

        const entry: Partial<SensorData> = {
            timestamp: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };

        for (const [key, cfg] of Object.entries(SENSOR_CONFIG) as [keyof typeof SENSOR_CONFIG, SensorConfig][]) {
            const range = cfg.max - cfg.min;
            const mid = cfg.min + range / 2;

            // Smooth sine-based trend (occupies full range)
            const trend = smoothNoise(t, cfg.freq, cfg.phase) * (range / 2);

            // Small high-frequency jitter on top
            const jitter = (Math.random() - 0.5) * 2 * cfg.noiseAmp * range;

            entry[key] = Math.min(cfg.max, Math.max(cfg.min, mid + trend + jitter));
        }

        data.push(entry as SensorData);
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
        SE: 55.2,
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
