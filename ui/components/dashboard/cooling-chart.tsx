'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SensorData } from '@/lib/data';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface CoolingChartProps {
    data: SensorData[];
}

export function CoolingChart({ data }: CoolingChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cooling System (CE, CP)</CardTitle>
                <CardDescription>Cooling efficiency (%) and power (kW)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="timestamp"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <YAxis
                                yAxisId="left"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                domain={[0, 100]}
                                label={{ value: '%', angle: -90, position: 'insideLeft' }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                domain={['auto', 'auto']}
                                label={{ value: 'kW', angle: 90, position: 'insideRight' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Bar
                                yAxisId="left"
                                dataKey="CE"
                                fill="#3b82f6"
                                fillOpacity={0.6}
                                name="Cooling Efficiency (%)"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="CP"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={false}
                                name="Cooling Power (kW)"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
