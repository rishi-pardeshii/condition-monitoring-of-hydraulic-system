'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    getCoolerConditionInfo,
    getValveConditionInfo,
    getPumpLeakageInfo,
    getAccumulatorInfo,
    SystemCondition,
} from '@/lib/data';
import {
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Info,
} from 'lucide-react';

interface SystemHealthSummaryProps {
    condition: SystemCondition;
}

export function SystemHealthSummary({ condition }: SystemHealthSummaryProps) {
    const coolerInfo = getCoolerConditionInfo(condition.coolerCondition);
    const valveInfo = getValveConditionInfo(condition.valveCondition);
    const pumpInfo = getPumpLeakageInfo(condition.pumpLeakage);
    const accumulatorInfo = getAccumulatorInfo(condition.accumulatorPressure);

    const conditions = [
        { name: 'Cooler', info: coolerInfo },
        { name: 'Valve', info: valveInfo },
        { name: 'Pump', info: pumpInfo },
        { name: 'Accumulator', info: accumulatorInfo },
    ];

    const criticalCount = conditions.filter((c) => c.info.color === 'destructive').length;
    const warningCount = conditions.filter((c) => c.info.color === 'warning').length;
    const optimalCount = conditions.filter((c) => c.info.color === 'success').length;

    const getOverallStatus = () => {
        if (criticalCount > 0) {
            return {
                status: 'Critical',
                color: 'bg-red-500',
                icon: <XCircle className="h-6 w-6 text-white" />,
                message: `${criticalCount} component(s) require immediate attention`,
            };
        }
        if (warningCount > 0) {
            return {
                status: 'Warning',
                color: 'bg-yellow-500',
                icon: <AlertTriangle className="h-6 w-6 text-white" />,
                message: `${warningCount} component(s) showing early signs of degradation`,
            };
        }
        return {
            status: 'Healthy',
            color: 'bg-green-500',
            icon: <CheckCircle2 className="h-6 w-6 text-white" />,
            message: 'All systems operating within normal parameters',
        };
    };

    const overall = getOverallStatus();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    System Health Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Overall Status */}
                <div className={`${overall.color} rounded-lg p-4 flex items-center gap-4`}>
                    <div className="p-2 bg-white/20 rounded-full">{overall.icon}</div>
                    <div>
                        <h3 className="text-white font-bold text-lg">{overall.status}</h3>
                        <p className="text-white/90 text-sm">{overall.message}</p>
                    </div>
                </div>

                {/* Component Status List */}
                <div className="space-y-2">
                    {conditions.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-2 h-2 rounded-full ${item.info.color === 'success'
                                        ? 'bg-green-500'
                                        : item.info.color === 'warning'
                                            ? 'bg-yellow-500'
                                            : item.info.color === 'destructive'
                                                ? 'bg-red-500'
                                                : 'bg-gray-500'
                                        }`}
                                />
                                <span className="font-medium">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{item.info.description}</span>
                                <Badge
                                    variant={
                                        item.info.color === 'success'
                                            ? 'default'
                                            : item.info.color === 'warning'
                                                ? 'secondary'
                                                : 'destructive'
                                    }
                                >
                                    {item.info.label}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{optimalCount}</div>
                        <div className="text-xs text-muted-foreground">Optimal</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-500">{warningCount}</div>
                        <div className="text-xs text-muted-foreground">Warning</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">{criticalCount}</div>
                        <div className="text-xs text-muted-foreground">Critical</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
