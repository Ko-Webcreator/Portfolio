import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { PageHead } from '@/components/common/PageHead';
import { useFirstController } from '@/hooks/useFirstController';
import BlocksStyles from '@/styles/Blocks.module.scss';
import HeaderStyles from '@/styles/Header.module.scss';
import MainStyles from '@/styles/Main.module.scss';
import SectionStyles from '@/styles/Section.module.scss';
import WholeStyles from '@/styles/Whole.module.scss';

import type { NextPage } from 'next';

const AnimateCanvas = dynamic(() => import('@/components/AnimateCanvas'), {
  ssr: false,
});

const Home: NextPage = () => {
  const main = useRef<HTMLElement>(null!);
  const prevSpPageYRef = useRef(0);

  const { header, blocks, onFirstController, secondBlock, section, rect } = useFirstController();

  useEffect(() => {
    window.addEventListener('wheel', (e) => {
      const deltaY = e.deltaY;
      onFirstController(deltaY, main);
    });
    window.addEventListener('touchmove', (e) => {
      const screenY = e.targetTouches[0].screenY;
      if (prevSpPageYRef.current < screenY) {
        onFirstController(1, main);
      } else if (prevSpPageYRef.current > screenY) {
        onFirstController(-1, main);
      }
      prevSpPageYRef.current = screenY;
    });
  }, [prevSpPageYRef, onFirstController]);

  return (
    <div className={`${WholeStyles.wrap}`}>
      <div className={WholeStyles.childWrap}>
        <PageHead description="Ko Portfolio" />
        <header className={HeaderStyles.title} ref={header}>
          <AnimateCanvas />
          <h1>
            Ko
            <br />
            Portfolio
          </h1>
        </header>
        <div className={BlocksStyles.wrap} ref={blocks}>
          <div className={BlocksStyles.arrow}>
            <div className={BlocksStyles.arrowInner} />
          </div>
        </div>
        <section className={SectionStyles.wrap} ref={section}>
          <h2 className={SectionStyles.leftFixed} data-text="Portfolio">
            Portfolio
          </h2>
          <div className={SectionStyles.fukuoka}>
            <Image alt="" layout="fill" src="/fukuoka.png" />
          </div>
          <div className={SectionStyles.rect} ref={rect} />
        </section>
        <div className={BlocksStyles.secondBlocks} ref={secondBlock} />
        <main className={MainStyles.wrap} ref={main}></main>
      </div>
    </div>
  );
};

export default Home;
