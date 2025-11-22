'use client'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { ReactNode } from 'react'
import styles from './ScrollArea.module.css'

interface ScrollAreaProps {
  children: ReactNode
  className?: string
}

export function ScrollArea({ children, className = '' }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root className={`${styles.root} ${className}`}>
      <ScrollAreaPrimitive.Viewport className={styles.viewport}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar className={styles.scrollbar} orientation="vertical">
        <ScrollAreaPrimitive.Thumb className={styles.thumb} />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Scrollbar
        className={styles.scrollbar}
        orientation="horizontal"
      >
        <ScrollAreaPrimitive.Thumb className={styles.thumb} />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner className={styles.corner} />
    </ScrollAreaPrimitive.Root>
  )
}
