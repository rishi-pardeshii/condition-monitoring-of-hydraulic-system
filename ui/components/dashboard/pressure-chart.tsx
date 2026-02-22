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

interface PressureChartProps {
    data: SensorData[];
}

export function PressureChart({ data }: PressureChartProps) {
    return (
        <Card className="col-span-full lg:col-span-2">
            <CardHeader>
                <CardTitle>Pressure Sensors (PS1-PS6)</CardTitle>
                <CardDescription>Real-time pressure readings in bar across all sensors</CardDescription>
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
                                label={{ value: 'bar', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="PS1" stroke="#ef4444" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="PS2" stroke="#f97316" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="PS3" stroke="#eab308" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="PS4" stroke="#22c55e" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="PS5" stroke="#3b82f6" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="PS6" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
