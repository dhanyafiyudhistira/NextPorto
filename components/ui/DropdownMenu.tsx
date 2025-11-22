'use client'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { ReactNode } from 'react'
import styles from './DropdownMenu.module.css'

export function DropdownMenu({ children }: { children: ReactNode }) {
  return <DropdownMenuPrimitive.Root>{children}</DropdownMenuPrimitive.Root>
}

export function DropdownMenuTrigger({ children }: { children: ReactNode }) {
  return (
    <DropdownMenuPrimitive.Trigger asChild>
      {children}
    </DropdownMenuPrimitive.Trigger>
  )
}

export function DropdownMenuContent({ children }: { children: ReactNode }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content className={styles.content} sideOffset={5}>
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}

interface DropdownMenuItemProps {
  children: ReactNode
  onSelect?: () => void
  className?: string
}

export function DropdownMenuItem({
  children,
  onSelect,
  className = '',
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      className={`${styles.item} ${className}`}
      onSelect={onSelect}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  )
}

export function DropdownMenuSeparator() {
  return <DropdownMenuPrimitive.Separator className={styles.separator} />
}
