'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer } from '@/components/ui/chart';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export const description = 'An interactive bar chart';

interface ChartData {
  date: string;
  new_biz: number;
  closed_biz: number;
}

interface MainChartProps {
  chartData: ChartData[];
}

const chartConfig = {
  new_biz: {
    label: 'Openings',
    color: 'var(--chart-1)',
    count: 0,
  },
  closed_biz: {
    label: 'Closures',
    color: 'var(--chart-2)',
    count: 0,
  },
} satisfies ChartConfig;

export function ChartBarInteractive({ chartData }: MainChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('new_biz');

  const total = React.useMemo(
    () => ({
      new_biz: chartData.reduce((acc, curr) => acc + curr.new_biz, 0),
      closed_biz: chartData.reduce((acc, curr) => acc + curr.closed_biz, 0),
    }),
    [chartData],
  );

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Opening and Closing Counts for Past 12 Months</CardTitle>
          <CardDescription>
            Showing total business openings and closures for the past year
          </CardDescription>
        </div>
        <div className="flex">
          {['new_biz', 'closed_biz'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => value.toLocaleString()}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
