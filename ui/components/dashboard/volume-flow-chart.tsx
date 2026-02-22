'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SensorData } from '@/lib/data';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface VolumeFlowChartProps {
    data: SensorData[];
}

export function VolumeFlowChart({ data }: VolumeFlowChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Volume Flow (FS1, FS2)</CardTitle>
                <CardDescription>Flow rate in l/min</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="timestamp"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                label={{ value: 'l/min', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="FS1"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.3}
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="FS2"
                                stroke="#8b5cf6"
                                fill="#8b5cf6"
                                fillOpacity={0.3}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
