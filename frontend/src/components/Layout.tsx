import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationCenter from './NotificationCenter';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <main className={styles.content}>
          {children}
        </main>
      </div>
      <NotificationCenter />
    </div>
  );
};

export default Layout;