import dynamic from 'next/dynamic';

import { PageHead } from '@/components/common/PageHead';
import { Github } from '@/components/svg/Github';
import styles from '@/styles/Home.module.scss';

import type { NextPage } from 'next';

const AnimateCanvas = dynamic(() => import('@/components/AnimateCanvas'), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <PageHead description="Ko Portfolio" />
      <h2 className={styles.leftFixed}>Portfolio</h2>
      <header className={styles.header}>
        <h1>
          Ko
          <br />
          Portfolio
        </h1>
        <AnimateCanvas />
        <div className={styles.horizontalLine} />
        <ul className={styles.verticalLine}>
          <li className={styles.on}>★</li>
          <li>☆</li>
          <li>☆</li>
          <li>☆</li>
          <li>
            <a href="https://github.com/Ko-Webcreator/Portfolio" rel="noreferrer" target="_blank">
              <Github color="inherit" size={30} />
            </a>
          </li>
        </ul>
      </header>
    </>
  );
};

export default Home;
