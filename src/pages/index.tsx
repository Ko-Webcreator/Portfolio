import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { PageHead } from '@/components/common/PageHead';
import { useFirstController } from '@/hooks/useFirstController';
import BlocksStyles from '@/styles/Blocks.module.scss';
import HeaderStyles from '@/styles/Header.module.scss';
import MainStyles from '@/styles/Main.module.scss';
import RectStyles from '@/styles/Rect.module.scss';
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
        <section className={RectStyles.wrap} ref={section}>
          <h2 className={RectStyles.leftFixed} data-text="Portfolio">
            Portfolio
          </h2>
          <div className={RectStyles.fukuoka}>
            <Image alt="" layout="fill" src="/fukuoka.png" />
          </div>
          <div className={RectStyles.rect} ref={rect} />
        </section>
        <div className={BlocksStyles.secondBlocks} ref={secondBlock} />
        <main className={MainStyles.wrap} ref={main}>
          <section className={MainStyles.section}>
            <figure>
              <a href="https://mercan.mercari.com/" target="_blkank" />
              <iframe scrolling="no" src="https://mercan.mercari.com/" />

              <Image alt="" layout="fill" src="/mac.png" />
            </figure>
            <article></article>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
