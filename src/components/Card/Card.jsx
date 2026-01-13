import styles from './Card.module.css'

function Card({ children, className = '', onClick, ...props }) {
  return (
    <div
      className={`${styles.card} ${className} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

