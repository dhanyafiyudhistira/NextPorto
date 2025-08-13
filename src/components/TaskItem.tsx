import { useState, useRef, useEffect } from 'react'
import { Task } from '../types'

interface Props {
  task: Task
  onToggle: () => void
  onDelete: () => void
  onUpdate: (title: string) => void
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  useEffect(() => {
    setTitle(task.title)
  }, [task.title])

  const commit = () => {
    if (title.trim()) onUpdate(title.trim())
    else onDelete()
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') {
      setTitle(task.title)
      setEditing(false)
    }
  }

  return (
    <li className={`task-item${task.completed ? ' completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        aria-label={task.completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
      />
      {editing ? (
        <input
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
        />
      ) : (
        <span
          className="title"
          tabIndex={0}
          onDoubleClick={() => setEditing(true)}
          onKeyDown={e => e.key === 'Enter' && setEditing(true)}
        >
          {task.title}
        </span>
      )}
      <button className="delete-btn" onClick={onDelete} aria-label={`Delete ${task.title}`}>×</button>
    </li>
  )
}
