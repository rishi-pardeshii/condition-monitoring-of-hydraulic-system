'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  SystemStatusCards,
  PressureChart,
  TemperatureChart,
  VolumeFlowChart,
  MotorPowerChart,
  VibrationChart,
  CoolingChart,
  SensorReadings,
  SystemHealthSummary,
} from '@/components/dashboard';
import {
  generateHistoricalData,
  getCurrentSensorData,
  getSystemCondition,
  SensorData,
  SystemCondition,
} from '@/lib/data';
import {
  Activity,
  BarChart3,
  Gauge,
  RefreshCw,
  Settings,
} from 'lucide-react';

export default function Dashboard() {
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [systemCondition, setSystemCondition] = useState<SystemCondition | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial data load
    loadData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setHistoricalData(generateHistoricalData(24));
    setCurrentData(getCurrentSensorData());
    setSystemCondition(getSystemCondition());
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  if (isLoading || !currentData || !systemCondition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Gauge className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Hydraulic System Monitor</h1>
                <p className="text-sm text-muted-foreground">
                  Condition Monitoring Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <div className="text-muted-foreground">Last updated</div>
                <div className="font-medium">
                  {lastUpdated.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </div>
              </div>
              <button
                onClick={loadData}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* System Status Cards */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Condition Overview
          </h2>
          <SystemStatusCards condition={systemCondition} />
        </section>

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="sensors" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              <span className="hidden sm:inline">Sensors</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <PressureChart data={historicalData} />
              </div>
              <div>
                <SystemHealthSummary condition={systemCondition} />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <TemperatureChart data={historicalData} />
              <VolumeFlowChart data={historicalData} />
            </div>
          </TabsContent>

          {/* Sensors Tab */}
          <TabsContent value="sensors" className="space-y-6">
            <SensorReadings data={currentData} />
            <div className="grid gap-6 md:grid-cols-2">
              <MotorPowerChart data={historicalData} />
              <VibrationChart data={historicalData} />
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <CoolingChart data={historicalData} />
              <VolumeFlowChart data={historicalData} />
            </div>
            <PressureChart data={historicalData} />
            <div className="grid gap-6 md:grid-cols-2">
              <TemperatureChart data={historicalData} />
              <VibrationChart data={historicalData} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Legend / Info Section */}
        <section className="border-t pt-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            Condition Monitoring Legend
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Cooler Condition</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li><span className="text-green-500">●</span> 100: Full efficiency</li>
                <li><span className="text-yellow-500">●</span> 20: Reduced efficiency</li>
                <li><span className="text-red-500">●</span> 3: Close to failure</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Valve Condition</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li><span className="text-green-500">●</span> 100: Optimal</li>
                <li><span className="text-yellow-500">●</span> 90: Small lag</li>
                <li><span className="text-red-500">●</span> 80: Severe lag</li>
                <li><span className="text-red-500">●</span> 73: Close to failure</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Pump Leakage</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li><span className="text-green-500">●</span> 0: No leakage</li>
                <li><span className="text-yellow-500">●</span> 1: Weak leakage</li>
                <li><span className="text-red-500">●</span> 2: Severe leakage</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Accumulator (bar)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li><span className="text-green-500">●</span> 130: Optimal</li>
                <li><span className="text-yellow-500">●</span> 115: Slightly reduced</li>
                <li><span className="text-red-500">●</span> 100: Severely reduced</li>
                <li><span className="text-red-500">●</span> 90: Close to failure</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          Hydraulic System Condition Monitoring Dashboard • Real-time ML-based Predictive Maintenance
        </div>
      </footer>
    </div>
  );
}
