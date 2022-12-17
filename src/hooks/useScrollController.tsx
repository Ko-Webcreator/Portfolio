import { useCallback, useEffect, useRef } from 'react';

import { slotStart } from '@/libs/slot';
import { ScrollToggleType } from '@/types/scrollToggleType';

import { useTransformController } from './useTransformController';

export const useScrollController = () => {
  const main = useRef<HTMLElement>(null!);
  const header = useRef<HTMLElement>(null!);
  const blocks = useRef<HTMLDivElement>(null!);
  const section = useRef<HTMLElement>(null!);
  const rect = useRef<HTMLDivElement>(null!);
  const secondBlock = useRef<HTMLDivElement>(null!);

  const currentYRef = useRef(0); // スクロール位置

  const pageIndex = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const firstSectionRef = useRef<HTMLElement>(null!);
  const secondSectionRef = useRef<HTMLElement>(null!);

  const {
    onMainExpandedTransform,
    onMainShrinkTransform,
    onRectExpandedTransform,
    onRectRemoveShrinkTransform,
    onRectFirstShrinkTransform,
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
          blocks.current.style.transform = `translateY(-${currentPosition}px)`;
          secondBlock.current.style.transform = `translateY(-${currentPosition}px)`;

          if (currentPosition < range) {
            // 現在位置が目的位置より進んでいなければアニメーションを続行させる
            animationID = requestAnimationFrame(move);
          } else {
            currentYRef.current = currentPosition;
          }
        } else {
          progress++; // 進捗を進める
          currentPosition = position - position * easeOut(progress / 100); // スクロールする位置を計算する
          header.current.style.transform = `translateY(-${currentPosition}px)`;
          blocks.current.style.transform = `translateY(-${currentPosition}px)`;
          secondBlock.current.style.transform = `translateY(-${currentPosition}px)`;

          if (currentPosition > range) {
            // 現在位置が目的位置より進んでいなければアニメーションを続行させる
            animationID = requestAnimationFrame(move);
          } else {
            currentYRef.current = range;
          }
        }
      };

      move();
    },
    [currentYRef, header, blocks],
  );

  const sleep = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

  const onFirstController = useCallback(
    async (deltaY: number) => {
      const time500 = 500,
        time1000 = 1000,
        time2000 = 2000;

      if (isAnimatingRef.current) {
        return;
      }
      isAnimatingRef.current = true;

      if (deltaY > 0) {
        // 下スクロール
        if (pageIndex.current === 0) {
          onScrollAnimation(0, section.current.clientHeight, 'down', firstSectionRef.current);

          await sleep(time1000);
          onMainExpandedTransform(main, firstSectionRef.current);
          onRectExpandedTransform(rect);

          await sleep(time1000);
          slotStart('first_article');
          pageIndex.current += 1;
        } else if (pageIndex.current === 1) {
          onMainShrinkTransform(main, firstSectionRef.current);
          onRectShrinkTransform(rect);

          await sleep(time1000);
          onMainExpandedTransform(main, secondSectionRef.current);
          onRectExpandedTransform(rect);

          await sleep(time500);
          slotStart('second_article');
          pageIndex.current += 1;
        }
      } else if (deltaY < 0 && currentYRef.current > 0) {
        // 上スクロール
        if (pageIndex.current === 1) {
          onScrollAnimation(currentYRef.current, 0, 'up');
          onMainShrinkTransform(main, firstSectionRef.current);
          onRectFirstShrinkTransform(rect);

          await sleep(time500);
          onRectRemoveShrinkTransform(rect);

          pageIndex.current -= 1;
        } else if (pageIndex.current === 2) {
          onMainShrinkTransform(main, secondSectionRef.current);
          onRectShrinkTransform(rect);

          await sleep(time1000);
          onMainExpandedTransform(main, firstSectionRef.current);
          onRectExpandedTransform(rect);

          await sleep(time500);
          slotStart('first_article');
          pageIndex.current -= 1;
        }
      }

      isAnimatingRef.current = false;
    },
    [
      pageIndex,
      isAnimatingRef,
      onMainExpandedTransform,
      onMainShrinkTransform,
      onRectExpandedTransform,
      onRectFirstShrinkTransform,
      onRectShrinkTransform,
      onRectRemoveShrinkTransform,
      onScrollAnimation,
    ],
  );

  /*
   * scroll reset
   **/
  useEffect(() => {
    window.addEventListener('resize', () => {
      // リサイズ時はスクロール位置をリセットする
      // currentYRef.current = 0;
      // header.current.style.transform = `translateY(${currentYRef.current}px)`;
      // blocks.current.style.transform = `translateY(${currentYRef.current}px)`;
      // secondBlock.current.style.transform = `translateY(${currentYRef.current}px)`;
    });
  }, [header, blocks]);

  return {
    blocks,
    firstSectionRef,
    header,
    main,
    onFirstController,
    rect,
    secondBlock,
    secondSectionRef,
    section,
  };
};
