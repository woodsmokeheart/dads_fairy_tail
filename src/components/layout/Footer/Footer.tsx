'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        Сделано <a 
          href="https://t.me/url64" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.link}
        >
          M1
        </a>, с <Heart className={styles.heart} /> и багами
      </p>
    </footer>
  );
}
