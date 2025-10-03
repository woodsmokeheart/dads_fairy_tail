'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Info, Library } from 'lucide-react';
import { Button } from '@/components/ui';
import AuthButton from '@/components/auth/AuthButton/AuthButton';
import styles from './Header.module.css';

export interface HeaderProps {
  magic?: boolean;
}

const Header: React.FC<HeaderProps> = ({ magic = false }) => {
  const router = useRouter();

  const handleAboutClick = () => {
    router.push('/about');
  };

  const handleStoriesClick = () => {
    router.push('/stories');
  };

  const headerClasses = magic ? `${styles.header} ${styles.magic}` : styles.header;

  return (
    <header className={headerClasses}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo} title="Папины сказки">
          <BookOpen className={styles.logoIcon} />
        </Link>

        <div className={styles.actions}>
                 <nav className={styles.nav}>
                   <Button
                     variant="ghost"
                     size="small"
                     onClick={handleAboutClick}
                     title="О нас"
                   >
                     <Info className="w-5 h-5" />
                   </Button>
                   <Button
                     variant="ghost"
                     size="small"
                     onClick={handleStoriesClick}
                     title="Библиотека сказок"
                   >
                     <Library className="w-5 h-5" />
                   </Button>
                 </nav>
          <div className={styles.authSection}>
            <AuthButton />
          </div>
        </div>
          </div>

    </header>
  );
};

export default Header;
