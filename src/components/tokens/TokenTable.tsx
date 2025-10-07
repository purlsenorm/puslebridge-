'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useTokens } from '@/lib/hooks/useTokens';
import { formatCurrency, formatCompact, formatPercentage } from '@/lib/utils/format';
import { Search } from 'lucide-react';

export function TokenTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: tokens, isLoading } = useTokens();

  // Deduplicate tokens by address (keep first occurrence)
  const uniqueTokens = tokens?.reduce((acc, token) => {
    if (!acc.find(t => t.address.toLowerCase() === token.address.toLowerCase())) {
      acc.push(token);
    }
    return acc;
  }, [] as typeof tokens);

  const filteredTokens = uniqueTokens?.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h %</TableHead>
              <TableHead className="text-right">Volume (24h)</TableHead>
              <TableHead className="text-right">Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTokens?.map((token, index) => (
              <TableRow key={`${token.address}-${index}`} className="hover:bg-muted/50">
                <TableCell className="font-medium text-muted-foreground">
                  {token.market_cap_rank || index + 1}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/token/${token.id}`}
                    className="flex items-center gap-3 hover:underline"
                  >
                    {token.image && (
                      <img
                        src={token.image}
                        alt={token.name}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-semibold">{token.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {token.symbol.toUpperCase()}
                      </div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(token.current_price)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      token.price_change_percentage_24h >= 0
                        ? 'default'
                        : 'destructive'
                    }
                    className={
                      token.price_change_percentage_24h >= 0
                        ? 'bg-green-500 hover:bg-green-600'
                        : ''
                    }
                  >
                    {formatPercentage(token.price_change_percentage_24h)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(token.total_volume, 0)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(token.market_cap, 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredTokens?.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No tokens found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </Card>
  );
}
