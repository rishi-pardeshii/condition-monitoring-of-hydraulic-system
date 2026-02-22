'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    getCoolerConditionInfo,
    getValveConditionInfo,
    getPumpLeakageInfo,
    getAccumulatorInfo,
    SystemCondition,
} from '@/lib/data';
import { Thermometer, Gauge, Droplets, Battery } from 'lucide-react';

interface ConditionCardProps {
    title: string;
    value: number;
    unit?: string;
    icon: React.ReactNode;
    info: { label: string; color: string; description: string };
    maxValue: number;
}

function ConditionCard({ title, value, unit, icon, info, maxValue }: ConditionCardProps) {
    const progressValue = (value / maxValue) * 100;

    const getBadgeVariant = (color: string) => {
        switch (color) {
            case 'success':
                return 'default';
            case 'warning':
                return 'secondary';
            case 'destructive':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getProgressColor = (color: string) => {
        switch (color) {
            case 'success':
                return 'bg-green-500';
            case 'warning':
                return 'bg-yellow-500';
            case 'destructive':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Card className="relative overflow-hidden">
            <div
                className={`absolute top-0 left-0 w-1 h-full ${info.color === 'success'
                    ? 'bg-green-500'
                    : info.color === 'warning'
                        ? 'bg-yellow-500'
                        : info.color === 'destructive'
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                    }`}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="h-8 w-8 text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold">{value}</span>
                    {unit && <span className="text-muted-foreground text-sm">{unit}</span>}
                    <Badge variant={getBadgeVariant(info.color)} className="ml-auto">
                        {info.label}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{info.description}</p>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                        className={`h-full transition-all ${getProgressColor(info.color)}`}
                        style={{ width: `${progressValue}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

interface SystemStatusCardsProps {
    condition: SystemCondition;
}

export function SystemStatusCards({ condition }: SystemStatusCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ConditionCard
                title="Cooler Condition"
                value={condition.coolerCondition}
                unit="%"
                icon={<Thermometer className="h-6 w-6" />}
                info={getCoolerConditionInfo(condition.coolerCondition)}
                maxValue={100}
            />
            <ConditionCard
                title="Valve Condition"
                value={condition.valveCondition}
                unit="%"
                icon={<Gauge className="h-6 w-6" />}
                info={getValveConditionInfo(condition.valveCondition)}
                maxValue={100}
            />
            <ConditionCard
                title="Internal Pump Leakage"
                value={condition.pumpLeakage}
                icon={<Droplets className="h-6 w-6" />}
                info={getPumpLeakageInfo(condition.pumpLeakage)}
                maxValue={2}
            />
            <ConditionCard
                title="Hydraulic Accumulator"
                value={condition.accumulatorPressure}
                unit="bar"
                icon={<Battery className="h-6 w-6" />}
                info={getAccumulatorInfo(condition.accumulatorPressure)}
                maxValue={130}
            />
        </div>
    );
}
