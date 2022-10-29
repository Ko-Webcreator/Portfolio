import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect } from 'react';

import { PageHead } from '@/components/common/PageHead';
import { useScrollController } from '@/hooks/useScrollController';
import AsideStyles from '@/styles/Aside.module.scss';
import HeaderStyles from '@/styles/Header.module.scss';
import MainStyles from '@/styles/Main.module.scss';
import WholeStyles from '@/styles/Whole.module.scss';

import type { NextPage } from 'next';

const AnimateCanvas = dynamic(() => import('@/components/AnimateCanvas'), {
  ssr: false,
});

const Home: NextPage = () => {
  const { header, rect, main, pageY, scroll } = useScrollController();

  useEffect(() => {
    scroll();
  }, [scroll]);

  return (
    <div className={`${WholeStyles.wrap}`}>
      <div className={WholeStyles.childWrap}>
        <PageHead description="Ko Portfolio" />
        <aside className={AsideStyles.section} ref={pageY}>
          <div className={AsideStyles.arrow}>
            <div className={AsideStyles.arrowInner} />
          </div>
        </aside>
        <header className={HeaderStyles.header} ref={header}>
          <h1>
            Ko
            <br />
            Portfolio
          </h1>
          <h2 className={HeaderStyles.leftFixed} data-text="Portfolio">
            Portfolio
          </h2>
          <AnimateCanvas />
          <div className={HeaderStyles.fukuoka}>
            <Image alt="" layout="fill" src="/fukuoka.png" />
          </div>
          <div className={HeaderStyles.rect} ref={rect} />
        </header>
        <main className={MainStyles.main} ref={main}></main>
      </div>
    </div>
  );
};

export default Home;
