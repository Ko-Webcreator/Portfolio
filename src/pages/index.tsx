import dynamic from 'next/dynamic';

import { PageHead } from '@/components/common/PageHead';
import AsideStyles from '@/styles/Aside.module.scss';
import HeaderStyles from '@/styles/Header.module.scss';
import MainStyles from '@/styles/Main.module.scss';
import SectionStyles from '@/styles/Section.module.scss';

import type { NextPage } from 'next';

const AnimateCanvas = dynamic(() => import('@/components/AnimateCanvas'), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <PageHead description="Ko Portfolio" />
      <aside className={AsideStyles.rect} />
      <section className={SectionStyles.section}>
        <h2 className={SectionStyles.leftFixed} data-text="Portfolio">
          Portfolio
        </h2>
        <a
          className={SectionStyles.githubIcon}
          href="https://github.com/Ko-Webcreator/Portfolio"
          rel="noreferrer"
          target="_blank"
        >
          {/* <Github color="inherit" size={50} /> */}
        </a>
      </section>
      <header className={HeaderStyles.header}>
        <h1>
          Ko
          <br />
          Portfolio
        </h1>
        <AnimateCanvas />
        <div className={HeaderStyles.arrow}>
          <div className={HeaderStyles.arrowInner} />
        </div>
      </header>
      <main className={MainStyles.main}></main>
    </>
  );
};

export default Home;
