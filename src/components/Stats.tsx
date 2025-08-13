interface Props {
  remaining: number
  onClearCompleted: () => void
}

export default function Stats({ remaining, onClearCompleted }: Props) {
  return (
    <div className="stats">
      <span>{remaining} {remaining === 1 ? 'task' : 'tasks'} left</span>
      <button onClick={onClearCompleted}>Clear completed</button>
    </div>
  )
}
