'use client';

import { Card } from '@/components/ui/card';
import { useTokenChart } from '@/lib/hooks/useTokens';
import { Skeleton } from '@/components/ui/skeleton';

interface SimpleChartProps {
  tokenId: string;
  days?: number;
}

/**
 * Simple price chart using canvas
 * This is a basic implementation - TradingView will provide advanced features
 */
export function SimpleChart({ tokenId, days = 7 }: SimpleChartProps) {
  const { data: chartData, isLoading } = useTokenChart(tokenId, days);

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!chartData || !chartData.prices || chartData.prices.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No chart data available</p>
      </Card>
    );
  }

  const prices = chartData.prices.map(([, price]) => price);
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const range = max - min;

  const points = prices.map((price, index) => {
    const x = (index / (prices.length - 1)) * 100;
    const y = 100 - ((price - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const isPositive = prices[prices.length - 1] >= prices[0];

  return (
    <Card className="p-4">
      <div className="h-[300px] w-full">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id={`gradient-${tokenId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                stopColor={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* Area under the line */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill={`url(#gradient-${tokenId})`}
          />

          {/* Price line */}
          <polyline
            points={points}
            fill="none"
            stroke={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </Card>
  );
}
