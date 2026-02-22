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
} from 'recharts';

interface VibrationChartProps {
    data: SensorData[];
}

export function VibrationChart({ data }: VibrationChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Vibration (VS1)</CardTitle>
                <CardDescription>Vibration amplitude in mm/s</CardDescription>
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
                                label={{ value: 'mm/s', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="VS1"
                                stroke="#f97316"
                                strokeWidth={2}
                                dot={false}
                                name="Vibration"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
