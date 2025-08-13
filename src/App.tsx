import { useState, useEffect } from 'react'
import TaskInput from './components/TaskInput'
import TaskItem from './components/TaskItem'
import Filters, { Filter } from './components/Filters'
import Stats from './components/Stats'
import { Task } from './types'

const STORAGE_KEY = 'tasks-v1'

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    const handle = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }, 300)
    return () => clearTimeout(handle)
  }, [tasks])

  const addTask = (title: string) => {
    setTasks([...tasks, { id: crypto.randomUUID(), title, completed: false, createdAt: Date.now() }])
  }

  const updateTask = (id: string, title: string) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, title } : t)))
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const clearCompleted = () => {
    setTasks(tasks.filter(t => !t.completed))
  }

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const remaining = tasks.filter(t => !t.completed).length

  return (
    <div className="todo-app">
      <h1 className="title">Todo</h1>
      <TaskInput onAdd={addTask} />
      <ul className="task-list">
        {filteredTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => toggleTask(task.id)}
            onDelete={() => deleteTask(task.id)}
            onUpdate={title => updateTask(task.id, title)}
          />
        ))}
      </ul>
      <Filters current={filter} onChange={setFilter} />
      <Stats remaining={remaining} onClearCompleted={clearCompleted} />
    </div>
  )
}

export default App
