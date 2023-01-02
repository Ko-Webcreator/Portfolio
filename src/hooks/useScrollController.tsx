import { useCallback, useEffect, useRef } from 'react';

import { sleep } from '@/libs/await/sleep';
import { slotStart } from '@/libs/slot';
import { ScrollToggleType } from '@/types/scrollToggleType';

import { useTransformController } from './useTransformController';

export const useScrollController = () => {
  const main = useRef<HTMLElement>(null!);
  const header = useRef<HTMLElement>(null!);
  const section = useRef<HTMLElement>(null!);
  const rect = useRef<HTMLDivElement>(null!);
  const arrow = useRef<HTMLDivElement>(null!);
  const secondBlock = useRef<HTMLDivElement>(null!);

  const currentYRef = useRef(0); // スクロール位置

  const pageIndex = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const firstSectionRef = useRef<HTMLElement>(null!);
  const secondSectionRef = useRef<HTMLElement>(null!);
  const thirdSectionRef = useRef<HTMLElement>(null!);
  const fourSectionRef = useRef<HTMLElement>(null!);

  const {
    onMainExpandTransform,
    onMainProfileTransform,
    onMainRemoveProfileTransform,
    onMainShrinkTransform,
    onRectExpandTransform,
    onRectFirstShrinkTransform,
    onRectLastTransform,
    onRectProfileTransform,
    onRectRemoveLastTransform,
    onRectRemoveProfileTransform,
    onRectRemoveShrinkTransform,
    onRectShrinkTransform,
  } = useTransformController();

  const onScrollAnimation = useCallback(
    (position: number, range: number, toggleType: ScrollToggleType, section?: HTMLElement) => {
      let currentPosition = 0; // スクロールする位置
      let progress = 0; // 現在の進捗 0 ～ 100
      let animationID: number;

      const easeOut = function (p: number) {
        // ease-out に当てはめた値を返す
        return p * (2 - p);
      };

      let move = function () {
        // 実際にスクロールを行う
        if (toggleType == 'down' && section) {
          progress++; // 進捗を進める
          currentPosition = range * easeOut(progress / 100); // スクロールする位置を計算する
          header.current.style.transform = `translateY(-${currentPosition}px)`;
          secondBlock.current.style.transform = `translateY(-${currentPosition}px)`;

          if (currentPosition < range) {
            // 現在位置が目的位置より進んでいなければアニメーションを続行させる
            animationID = requestAnimationFrame(move);
          } else {
            currentYRef.current = currentPosition;
            cancelAnimationFrame(animationID);
          }
        } else {
          progress++; // 進捗を進める
          currentPosition = position - position * easeOut(progress / 100); // スクロールする位置を計算する
          header.current.style.transform = `translateY(-${currentPosition}px)`;
          secondBlock.current.style.transform = `translateY(-${currentPosition}px)`;

          if (currentPosition > range) {
            // 現在位置が目的位置より進んでいなければアニメーションを続行させる
            animationID = requestAnimationFrame(move);
          } else {
            currentYRef.current = range;
            cancelAnimationFrame(animationID);
          }
        }
      };

      move();
    },
    [currentYRef, header],
  );

  const onFirstController = useCallback(
    async (deltaY: number) => {
      if (isAnimatingRef.current) {
        return;
      }

      isAnimatingRef.current = true;

      if (deltaY > 0) {
        // 下スクロール
        if (pageIndex.current === 0) {
          onScrollAnimation(0, section.current.clientHeight, 'down', firstSectionRef.current);

          await sleep(500);
          onMainExpandTransform(main, firstSectionRef.current);
          onRectExpandTransform(rect);

          await sleep(500);
          slotStart('first_article');

          await sleep(1000);
          pageIndex.current += 1;
        } else if (pageIndex.current === 1) {
          onMainShrinkTransform(main, firstSectionRef.current);
          onRectShrinkTransform(rect);

          await sleep(1000);
          onMainExpandTransform(main, secondSectionRef.current);
          onRectExpandTransform(rect);

          await sleep(500);
          slotStart('second_article');
          pageIndex.current += 1;
        } else if (pageIndex.current === 2) {
          onMainShrinkTransform(main, secondSectionRef.current);
          onRectShrinkTransform(rect);

          await sleep(1000);
          onMainExpandTransform(main, thirdSectionRef.current);
          onRectExpandTransform(rect);

          await sleep(500);
          slotStart('third_article');
          pageIndex.current += 1;
        } else if (pageIndex.current === 3) {
          onMainShrinkTransform(main, thirdSectionRef.current);
          onRectShrinkTransform(rect);

          await sleep(1000);
          onMainProfileTransform(main, fourSectionRef.current, arrow.current);
          onRectProfileTransform(rect);

          await sleep(1000);
          pageIndex.current += 1;
        }
      } else if (deltaY < 0 && currentYRef.current > 0) {
        // 上スクロール
        if (pageIndex.current === 1) {
          onScrollAnimation(currentYRef.current, 0, 'up');
          onMainShrinkTransform(main, firstSectionRef.current);
          onRectFirstShrinkTransform(rect);

          await sleep(500);
          onRectRemoveShrinkTransform(rect);

          pageIndex.current -= 1;
        } else if (pageIndex.current === 2) {
          onMainShrinkTransform(main, secondSectionRef.current);
          onRectShrinkTransform(rect);

          await sleep(1000);
          onMainExpandTransform(main, firstSectionRef.current);
          onRectExpandTransform(rect);

          await sleep(500);
          slotStart('first_article');
          pageIndex.current -= 1;
        } else if (pageIndex.current === 3) {
          onMainShrinkTransform(main, thirdSectionRef.current);
          onRectShrinkTransform(rect);

          await sleep(1000);
          onMainExpandTransform(main, secondSectionRef.current);
          onRectExpandTransform(rect);

          await sleep(500);
          slotStart('second_article');
          pageIndex.current -= 1;
        } else if (pageIndex.current === 4) {
          onMainRemoveProfileTransform(main, fourSectionRef.current, arrow.current);
          onRectLastTransform(rect);

          onRectRemoveLastTransform(rect);
          onRectRemoveProfileTransform(rect);

          await sleep(500);
          onRectExpandTransform(rect);
          onMainExpandTransform(main, thirdSectionRef.current);

          await sleep(1000);

          pageIndex.current -= 1;
        }
      }
      isAnimatingRef.current = false;
    },
    [
      pageIndex,
      isAnimatingRef,
      onMainExpandTransform,
      onMainProfileTransform,
      onMainRemoveProfileTransform,
      onMainShrinkTransform,
      onRectExpandTransform,
      onRectFirstShrinkTransform,
      onRectShrinkTransform,
      onRectRemoveShrinkTransform,
      onRectRemoveProfileTransform,
      onRectProfileTransform,
      onScrollAnimation,
      onRectLastTransform,
      onRectRemoveLastTransform,
    ],
  );

  useEffect(() => {
    window.addEventListener('resize', async () => {
      /*
       * ブラウザでSPのレスポンシブ確認をしてる時は効かないのでリロードする
       **/
      const ua = navigator.userAgent;
      if ((ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0) && ua.indexOf('Mobile') > 0) {
        return false;
      }

      /*
       * リサイズ時はスクロール位置をリセットする
       **/
      await sleep(500);

      currentYRef.current = 0;
      header.current.style.transform = `translateY(${currentYRef.current}px)`;
      secondBlock.current.style.transform = `translateY(${currentYRef.current}px)`;

      if (pageIndex.current === 1) {
        onMainShrinkTransform(main, firstSectionRef.current);
      }
      if (pageIndex.current === 2) {
        onMainShrinkTransform(main, secondSectionRef.current);
      }
      if (pageIndex.current === 3) {
        onMainShrinkTransform(main, thirdSectionRef.current);
      }
      if (pageIndex.current === 4) {
        onMainRemoveProfileTransform(main, fourSectionRef.current, arrow.current);

        onRectRemoveLastTransform(rect);
        onRectRemoveProfileTransform(rect);

        await sleep(500);
        onRectExpandTransform(rect);
      }

      onRectFirstShrinkTransform(rect);

      await sleep(500);

      onRectRemoveShrinkTransform(rect);

      pageIndex.current = 0;
    });
  }, [
    onMainRemoveProfileTransform,
    onMainShrinkTransform,
    onRectExpandTransform,
    onRectFirstShrinkTransform,
    onRectRemoveLastTransform,
    onRectRemoveProfileTransform,
    onRectRemoveShrinkTransform,
    header,
  ]);

  return {
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
  };
};
