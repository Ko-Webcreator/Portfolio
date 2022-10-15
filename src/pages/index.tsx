import dynamic from 'next/dynamic';

import { PageHead } from '@/components/common/PageHead';
import { Github } from '@/components/svg/Github';
import AsideStyles from '@/styles/Aside.module.scss';
import HomeStyles from '@/styles/Home.module.scss';
import NavStyles from '@/styles/Nav.module.scss';

import type { NextPage } from 'next';

const AnimateCanvas = dynamic(() => import('@/components/AnimateCanvas'), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <PageHead description="Ko Portfolio" />
      <aside className={AsideStyles.rect} />
      <nav className={NavStyles.nav}>
        <h2 className={NavStyles.leftFixed} data-text="Portfolio">
          Portfolio
        </h2>
        <ul className={NavStyles.menu}>
          <li className={NavStyles.on}>★</li>
          <li>☆</li>
          <li>☆</li>
          <li>☆</li>
          <li>
            <a href="https://github.com/Ko-Webcreator/Portfolio" rel="noreferrer" target="_blank">
              <Github color="inherit" size={30} />
            </a>
          </li>
        </ul>
      </nav>
      <header className={HomeStyles.header}>
        <h1>
          Ko
          <br />
          Portfolio
        </h1>
        <AnimateCanvas />
      </header>
    </>
  );
};

export default Home;
