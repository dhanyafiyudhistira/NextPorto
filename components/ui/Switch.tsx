'use client'

import * as SwitchPrimitive from '@radix-ui/react-switch'
import styles from './Switch.module.css'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export function Switch({ checked, onCheckedChange, className = '' }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={`${styles.root} ${className}`}
      checked={checked}
      onCheckedChange={onCheckedChange}
    >
      <SwitchPrimitive.Thumb className={styles.thumb} />
    </SwitchPrimitive.Root>
  )
}
