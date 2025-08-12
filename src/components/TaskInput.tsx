import { useState } from 'react'

interface Props {
  onAdd: (title: string) => void
}

export default function TaskInput({ onAdd }: Props) {
  const [value, setValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onAdd(value.trim())
      setValue('')
    }
  }

  return (
    <input
      aria-label="New task"
      placeholder="Add a task"
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  )
}
