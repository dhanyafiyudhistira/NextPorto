export type Filter = 'all' | 'active' | 'completed'

interface Props {
  current: Filter
  onChange: (filter: Filter) => void
}

const options: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]

export default function Filters({ current, onChange }: Props) {
  return (
    <div className="filters" role="group" aria-label="Filter tasks">
      {options.map(opt => (
        <button
          key={opt.value}
          aria-current={current === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
