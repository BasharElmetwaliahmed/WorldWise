import styles from './SideBar.module.css'
import AppNav from './AppNav'
import Footer from './Footer';
import Logo from './Logo'
import { Outlet } from 'react-router-dom';
function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet/>
      <Footer/>
    </div>
  );
}

export default SideBar