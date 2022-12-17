import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { PageHead } from '@/components/common/PageHead';
import { useScrollController } from '@/hooks/useScrollController';
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
  const prevSpPageYRef = useRef(0);

  const {
    blocks,
    firstSectionRef,
    header,
    main,
    onFirstController,
    rect,
    secondBlock,
    secondSectionRef,
    section,
  } = useScrollController();

  useEffect(() => {
    window.addEventListener('wheel', (e) => {
      const deltaY = e.deltaY;
      onFirstController(deltaY);
    });
    window.addEventListener('touchstart', (e) => {
      prevSpPageYRef.current = e.targetTouches[0].clientY;
    });
    window.addEventListener('touchend', (e) => {
      const clientY = e.changedTouches[0].clientY;
      if (prevSpPageYRef.current < clientY) {
        onFirstController(-1);
      } else if (prevSpPageYRef.current > clientY) {
        onFirstController(1);
      }
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
          <section className={MainStyles.section} ref={firstSectionRef}>
            <figure>
              <a href="https://mercan.mercari.com/" target="_blkank" />
              <iframe src="https://mercan.mercari.com/" />

              <Image alt="" layout="fill" src="/mac.png" />
            </figure>
            <article id="first_article">
              <h2>オウンドメディア</h2>
              <p>
                <b>使用技術 :</b>
                <span data-slot="NuxtJS, WordPress, GraphQL" />
              </p>
              <p>
                <b>製作期間 / 人数 :</b>
                <span data-slot="約4ヶ月 / 1人" />
              </p>
              <p>
                <b>説明 :</b>
                <span
                  data-slot="WordPress を Headless にして GraphQL にて API
                を作成しました、ページ生成は NuxtJS の static generate 機能を使用して
                表示しています。"
                />
              </p>
            </article>
          </section>
          <section className={MainStyles.section} ref={secondSectionRef}>
            <figure>
              <a href="https://yomcoma.com/user/" target="_blkank" />
              <iframe src="https://yomcoma.com/user/" />

              <Image alt="" layout="fill" src="/mac.png" />
            </figure>
            <article id="second_article">
              <h2>YOMcoma アプリ開発</h2>
              <p>
                <b>使用技術 :</b>
                <span data-slot="Flutter" />
              </p>
              <p>
                <b>開発期間 / 人数 :</b>
                <span data-slot="約6ヶ月 / 1人" />
              </p>
              <p>
                <b>説明 :</b>
                <span data-slot="プライベートで Flutter の開発を行ってた所、開発にアサインされました。フロントの設計から実装までを担当しました。" />
              </p>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
