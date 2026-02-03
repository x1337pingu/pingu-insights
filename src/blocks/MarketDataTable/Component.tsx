import { cn } from '@/utilities/ui'
import React from 'react'

type MarketDataRow = {
  symbol: string
  price: string
  change?: string | null
  changePercent?: string | null
  id?: string | null
}

type Props = {
  className?: string
  title?: string | null
  rows?: MarketDataRow[] | null
  disclaimer?: string | null
  blockType?: string
}

export const MarketDataTableBlock: React.FC<Props> = ({
  className,
  title,
  rows,
  disclaimer,
}) => {
  return (
    <div className={cn('my-8', className)}>
      {title && (
        <h4 className="text-sm font-semibold text-[#8D8DC0] uppercase tracking-wider mb-3">{title}</h4>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2.5 font-medium text-[#8D8DC0] text-xs uppercase tracking-wider">Symbol</th>
              <th className="text-right px-4 py-2.5 font-medium text-[#8D8DC0] text-xs uppercase tracking-wider">Price</th>
              <th className="text-right px-4 py-2.5 font-medium text-[#8D8DC0] text-xs uppercase tracking-wider">Change</th>
              <th className="text-right px-4 py-2.5 font-medium text-[#8D8DC0] text-xs uppercase tracking-wider">%</th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((row, index) => {
              // Only color the % column, and only for clearly numerical values
              const pct = row.changePercent || ''
              const isPositive = pct.startsWith('+') || pct === 'Beat'
              const isNegative = pct.startsWith('-') || pct === 'Miss' || pct.toLowerCase().startsWith('worst')

              return (
                <tr
                  key={index}
                  className={cn(
                    'border-b border-border/40',
                    index % 2 === 1 ? 'bg-card/40' : '',
                  )}
                >
                  <td className="px-4 py-3 font-mono font-semibold text-[#D5D5DA]">{row.symbol}</td>
                  <td className="px-4 py-3 text-right text-[#e8e8ee] font-mono">{row.price}</td>
                  <td className="px-4 py-3 text-right font-mono text-[#8D8DC0]">
                    {row.change || '-'}
                  </td>
                  <td
                    className={cn('px-4 py-3 text-right font-mono text-xs', {
                      'text-[#72FFA6]': isPositive,
                      'text-[#e78284]': isNegative,
                      'text-[#8D8DC0]': !isPositive && !isNegative,
                    })}
                  >
                    {row.changePercent || '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {disclaimer && (
        <p className="text-[#8D8DC0] text-xs mt-3 italic">{disclaimer}</p>
      )}
    </div>
  )
}
