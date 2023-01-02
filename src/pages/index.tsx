import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';
import { Engine } from 'tsparticles-engine';

import { PageHead } from '@/components/common/PageHead';
import { useScrollController } from '@/hooks/useScrollController';
import { config } from '@/libs/particles';
import HeaderStyles from '@/styles/Header.module.scss';
import MainStyles from '@/styles/Main.module.scss';
import RectStyles from '@/styles/Rect.module.scss';
import WholeStyles from '@/styles/Whole.module.scss';

import type { NextPage } from 'next';
// const AnimateCanvas = dynamic(() => import('@/components/AnimateCanvas'), {
//   ssr: false,
// });

const Home: NextPage = () => {
  const prevSpPageYRef = useRef(0);

  const {
    arrow,
    firstSectionRef,
    fourSectionRef,
    header,
    main,
    onFirstController,
    rect,
    secondBlock,
    secondSectionRef,
    section,
    thirdSectionRef,
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
      const path = (e as any).path;
      if (path.length && path[0].classList.contains('notMove')) {
        //要素内のスクロール時だけ無効にする
        return;
      }

      const clientY = e.changedTouches[0].clientY;
      if (prevSpPageYRef.current < clientY) {
        onFirstController(-1);
      } else if (prevSpPageYRef.current > clientY) {
        onFirstController(1);
      }
    });
  }, [prevSpPageYRef, onFirstController]);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <>
      <PageHead description="福岡に住む Ko Web Creator の Portfolio Site です。" />
      <div className={`${WholeStyles.wrap}`}>
        <div className={WholeStyles.childWrap}>
          <header className={HeaderStyles.title} ref={header}>
            <h1>
              Ko
              <br />
              Portfolio
            </h1>
          </header>
          <section className={RectStyles.wrap} ref={section}>
            <h2 className={RectStyles.leftFixed} data-text="Portfolio">
              Portfolio
            </h2>
            <Particles className={RectStyles.particles} init={particlesInit} options={config} />
            <div className={RectStyles.fukuoka}>
              <Image alt="" layout="fill" src="/fukuoka.png" />
            </div>
            <div className={RectStyles.rect} ref={rect} />
            <div className={RectStyles.arrow} ref={arrow}>
              <div className={RectStyles.arrowInner} />
            </div>
          </section>
          <div className={RectStyles.secondBlocks} ref={secondBlock} />
          <main className={MainStyles.wrap} ref={main}>
            <section className={MainStyles.section} ref={firstSectionRef}>
              <figure>
                <a href="https://mercan.mercari.com/" rel="noreferrer" target="_blank" />
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
                を作成しました、ページ生成は NuxtJS の static generate 機能を使用して実装しています。"
                  />
                </p>
              </article>
            </section>
            <section className={MainStyles.section} ref={secondSectionRef}>
              <figure>
                <a href="https://yomcoma.com/user/" rel="noreferrer" target="_blank" />
                <iframe src="https://yomcoma.com/user/" />

                <Image alt="" layout="fill" src="/mac.png" />
              </figure>
              <article id="second_article">
                <h2>YOMcoma アプリ開発</h2>
                <p>
                  <b>使用技術 :</b>
                  <span data-slot="Flutter, Firebase(認証周り)" />
                </p>
                <p>
                  <b>開発期間 / 人数 :</b>
                  <span data-slot="約8ヶ月 / 3人" />
                </p>
                <p>
                  <b>説明 :</b>
                  <span data-slot="プライベートで Flutter での開発を行ってた所、アプリ開発にアサインされました。フロントの設計から実装までを担当しました。" />
                </p>
              </article>
            </section>
            <section className={MainStyles.section} ref={thirdSectionRef}>
              <figure>
                <a href="https://yomcoma.com/writer/" rel="noreferrer" target="_blank" />
                <iframe src="https://yomcoma.com/writer/" />
                <Image alt="" layout="fill" src="/mac.png" />
              </figure>
              <article id="third_article">
                <h2>YOMcoma Web開発</h2>
                <p>
                  <b>使用技術 :</b>
                  <span data-slot="NextJS, Firebase(認証周り), NestJS, MySQL, GCP" />
                </p>
                <p>
                  <b>開発期間 / 人数 :</b>
                  <span data-slot="約8ヶ月 / 3人" />
                </p>
                <p>
                  <b>説明 :</b>
                  <span data-slot="アプリ開発後は管理画面の開発を任さられました。フロントは NextJS を使用して開発してます。またバックエンドの実装も一部任さられました。バックエンドは NestJS と MySQL でインフラ周りは GCP を使用しています。" />
                </p>
              </article>
            </section>
            <section className={MainStyles.profile} ref={fourSectionRef}>
              <div className={MainStyles.icon}>
                <Image alt="" layout="fill" objectFit="cover" src="/pic.png" />
              </div>
              <div className={MainStyles.pin} />
              <article>
                <p className="notMove">
                  ポートフォリオを見ていただきありがとうございます。
                  <br />
                  趣味で行ってたWeb制作を仕事で行いたく20代後半に上京しコーダーとして約7年間従事してきました。
                  <br />
                  そしてFlutterを使用したアプリ開発を趣味で行ってた所、今いる会社にて制作からアプリ開発にアサインされました。
                  <br />
                  そのあとこちらも独学で学んでた React を使用した開発にもアサインされ
                  Web開発も行いました。
                  <br />
                  また直近ですと NestJS を使用したバックエンド実装にも携わりました。
                  <br />
                  そうした中で今回地元に帰省するので転職活動を行うことになりました。
                  <br />
                  今まで学んできた事をアウトプットしつつ、今後はより開発を追求したいと思ってます。
                  <br />
                  ご検討よろしくお願いします。
                </p>
                <a
                  href="https://github.com/Ko-Webcreator/Portfolio"
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>Source code is here ❤</span>
                  <span>Thanks for watching My portfolio！</span>
                </a>
              </article>
            </section>
          </main>
          <p className={MainStyles.copyright} data-text="2023 Ko Portfolio">
            &copy; 2023 Ko Portfolio
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
