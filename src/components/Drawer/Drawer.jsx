import { useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './Drawer.module.css'

function Drawer({ isOpen, onClose, title, children, position = 'right', width = '400px' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div
        className={`${styles.drawer} ${styles[position]}`}
        style={{ width }}
      >
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close drawer">
            <X size={20} />
          </button>
        </div>
        <div className={styles.drawerContent}>{children}</div>
      </div>
    </>
  )
}

export default Drawer

