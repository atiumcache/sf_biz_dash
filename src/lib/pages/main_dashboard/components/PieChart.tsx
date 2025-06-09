'use client';

import { Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import type { ChartConfig } from '@/components/ui/chart';

export const description = 'A donut chart';

interface ChartPieDonutProps {
  chartConfig: ChartConfig;
}

export function ChartPieDonut({ chartConfig }: ChartPieDonutProps) {
  const currentMonth = new Date().toDateString();

  // Convert ChartConfig to pie chart data format
  const chartData = Object.entries(chartConfig).map(([industry, config]) => ({
    name: industry,
    value: config.count,
    fill: config.color,
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Industries - Segmented by NAIC Codes</CardTitle>
        <CardDescription>Current as of {currentMonth}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
