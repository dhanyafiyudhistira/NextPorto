'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import styles from './Slider.module.css'

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  max?: number
  step?: number
  className?: string
}

export function Slider({
  value,
  onValueChange,
  max = 100,
  step = 1,
  className = '',
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={`${styles.root} ${className}`}
      value={value}
      onValueChange={onValueChange}
      max={max}
      step={step}
    >
      <SliderPrimitive.Track className={styles.track}>
        <SliderPrimitive.Range className={styles.range} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className={styles.thumb} />
    </SliderPrimitive.Root>
  )
}
