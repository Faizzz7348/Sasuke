import { useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface VirtualizedListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => ReactNode
  overscan?: number
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const offsetY = startIndex * itemHeight

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: containerHeight, overflow: 'auto' }}
      className="relative"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, i) => (
            <div key={startIndex + i} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
