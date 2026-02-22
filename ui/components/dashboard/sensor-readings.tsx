'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SensorData } from '@/lib/data';
import {
    Gauge,
    Thermometer,
    Activity,
    Zap,
    Droplets,
    Wind,
    ThermometerSnowflake,
} from 'lucide-react';

interface SensorReadingsProps {
    data: SensorData;
}

interface SensorItemProps {
    label: string;
    value: number;
    unit: string;
    icon: React.ReactNode;
    color: string;
}

function SensorItem({ label, value, unit, icon, color }: SensorItemProps) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${color}`}>{icon}</div>
                <span className="font-medium text-sm">{label}</span>
            </div>
            <div className="text-right">
                <span className="font-bold">{value.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm ml-1">{unit}</span>
            </div>
        </div>
    );
}

export function SensorReadings({ data }: SensorReadingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Live Sensor Readings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Pressure Sensors */}
                <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <Gauge className="h-4 w-4" /> Pressure Sensors (bar)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <SensorItem
                            label="PS1"
                            value={data.PS1}
                            unit="bar"
                            icon={<Gauge className="h-4 w-4 text-white" />}
                            color="bg-red-500"
                        />
                        <SensorItem
                            label="PS2"
                            value={data.PS2}
                            unit="bar"
                            icon={<Gauge className="h-4 w-4 text-white" />}
                            color="bg-orange-500"
                        />
                        <SensorItem
                            label="PS3"
                            value={data.PS3}
                            unit="bar"
                            icon={<Gauge className="h-4 w-4 text-white" />}
                            color="bg-yellow-500"
                        />
                        <SensorItem
                            label="PS4"
                            value={data.PS4}
                            unit="bar"
                            icon={<Gauge className="h-4 w-4 text-white" />}
                            color="bg-green-500"
                        />
                        <SensorItem
                            label="PS5"
                            value={data.PS5}
                            unit="bar"
                            icon={<Gauge className="h-4 w-4 text-white" />}
                            color="bg-blue-500"
                        />
                        <SensorItem
                            label="PS6"
                            value={data.PS6}
                            unit="bar"
                            icon={<Gauge className="h-4 w-4 text-white" />}
                            color="bg-purple-500"
                        />
                    </div>
                </div>

                {/* Temperature Sensors */}
                <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <Thermometer className="h-4 w-4" /> Temperature Sensors (°C)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <SensorItem
                            label="TS1"
                            value={data.TS1}
                            unit="°C"
                            icon={<Thermometer className="h-4 w-4 text-white" />}
                            color="bg-red-500"
                        />
                        <SensorItem
                            label="TS2"
                            value={data.TS2}
                            unit="°C"
                            icon={<Thermometer className="h-4 w-4 text-white" />}
                            color="bg-orange-500"
                        />
                        <SensorItem
                            label="TS3"
                            value={data.TS3}
                            unit="°C"
                            icon={<Thermometer className="h-4 w-4 text-white" />}
                            color="bg-yellow-500"
                        />
                        <SensorItem
                            label="TS4"
                            value={data.TS4}
                            unit="°C"
                            icon={<Thermometer className="h-4 w-4 text-white" />}
                            color="bg-green-500"
                        />
                    </div>
                </div>

                {/* Other Sensors */}
                <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <Activity className="h-4 w-4" /> Other Sensors
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <SensorItem
                            label="Motor Power"
                            value={data.EPS1}
                            unit="W"
                            icon={<Zap className="h-4 w-4 text-white" />}
                            color="bg-emerald-500"
                        />
                        <SensorItem
                            label="Flow FS1"
                            value={data.FS1}
                            unit="l/min"
                            icon={<Droplets className="h-4 w-4 text-white" />}
                            color="bg-blue-500"
                        />
                        <SensorItem
                            label="Flow FS2"
                            value={data.FS2}
                            unit="l/min"
                            icon={<Droplets className="h-4 w-4 text-white" />}
                            color="bg-indigo-500"
                        />
                        <SensorItem
                            label="Vibration"
                            value={data.VS1}
                            unit="mm/s"
                            icon={<Activity className="h-4 w-4 text-white" />}
                            color="bg-amber-500"
                        />
                        <SensorItem
                            label="Cool Efficiency"
                            value={data.CE}
                            unit="%"
                            icon={<ThermometerSnowflake className="h-4 w-4 text-white" />}
                            color="bg-cyan-500"
                        />
                        <SensorItem
                            label="Cool Power"
                            value={data.CP}
                            unit="kW"
                            icon={<Wind className="h-4 w-4 text-white" />}
                            color="bg-teal-500"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
