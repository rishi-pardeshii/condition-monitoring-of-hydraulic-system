'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SensorData } from '@/lib/data';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface TemperatureChartProps {
    data: SensorData[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Temperature Sensors (TS1-TS4)</CardTitle>
                <CardDescription>Temperature readings in °C</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="timestamp"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                domain={['auto', 'auto']}
                                label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="TS1" stroke="#ef4444" strokeWidth={2} dot={false} name="TS1" />
                            <Line type="monotone" dataKey="TS2" stroke="#f97316" strokeWidth={2} dot={false} name="TS2" />
                            <Line type="monotone" dataKey="TS3" stroke="#eab308" strokeWidth={2} dot={false} name="TS3" />
                            <Line type="monotone" dataKey="TS4" stroke="#22c55e" strokeWidth={2} dot={false} name="TS4" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
