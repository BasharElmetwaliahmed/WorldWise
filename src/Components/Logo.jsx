// import logo from '../../public/logo.png'
import { Link } from 'react-router-dom'
import styles from './Logo.module.css'
function Logo() {
  return (
    <Link to='/'>
        <img src='/logo.png' alt='world wise logo' className={styles.logo} />
    </Link>
  )
}

export default Logo