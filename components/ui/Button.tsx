import { ButtonHTMLAttributes, forwardRef } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
  size?: 'small' | 'medium' | 'large' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', className = '', ...props }, ref) => {
    const classNames = [
      styles.button,
      styles[variant],
      styles[size],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return <button ref={ref} className={classNames} {...props} />
  }
)

Button.displayName = 'Button'
