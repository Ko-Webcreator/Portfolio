import dynamic from 'next/dynamic';

import { PageHead } from '@/components/common/PageHead';
import { Github } from '@/components/svg/Github';
import AsideStyles from '@/styles/Aside.module.scss';
import HomeStyles from '@/styles/Home.module.scss';

import type { NextPage } from 'next';

const AnimateCanvas = dynamic(() => import('@/components/AnimateCanvas'), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <PageHead description="Ko Portfolio" />
      <aside className={AsideStyles.aside}>
        <h2 className={AsideStyles.leftFixed}>Portfolio</h2>
        <div className={AsideStyles.horizontalLine} />
        <div className={`${AsideStyles.menu} ${AsideStyles.verticalLine}`} />
        <ul className={AsideStyles.menu}>
          <li className={AsideStyles.on}>★</li>
          <li>☆</li>
          <li>☆</li>
          <li>☆</li>
          <li>
            <a href="https://github.com/Ko-Webcreator/Portfolio" rel="noreferrer" target="_blank">
              <Github color="inherit" size={30} />
            </a>
          </li>
        </ul>
      </aside>
      <header className={HomeStyles.header}>
        <h1>
          Ko
          <br />
          Portfolio
        </h1>
        <div className={HomeStyles.rect} />
        <AnimateCanvas />
      </header>
    </>
  );
};

export default Home;
