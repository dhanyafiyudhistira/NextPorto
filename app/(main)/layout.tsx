import { Sidebar } from '@/components/sidebar/Sidebar'
import { Player } from '@/components/player/Player'
import styles from './layout.module.css'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
      <Player />
    </div>
  )
}
