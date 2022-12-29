import { useCallback, useEffect, useRef } from 'react';

import { sleep } from '@/libs/await/sleep';
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

  const onFirstController = useCallback(
    async (deltaY: number) => {
      const time500 = 500,
        time1000 = 1000;

      if (isAnimatingRef.current) {
        return;
      }

      isAnimatingRef.current = true;

      if (deltaY > 0) {
        // 下スクロール
        if (pageIndex.current === 0) {
          onScrollAnimation(0, section.current.clientHeight, 'down', firstSectionRef.current);

          await sleep(time1000);
          onMainExpandTransform(main, firstSectionRef.current);
          onRectExpandTransform(rect);

          await sleep(time1000);
          slotStart('first_article');
          pageIndex.current += 1;
        } else if (pageIndex.current === 1) {
          onMainShrinkTransform(main, firstSectionRef.current);
          onRectShrinkTransform(rect);

          await sleep(time1000);
          onMainExpandTransform(main, secondSectionRef.current);
          onRectExpandTransform(rect);

          await sleep(time500);
          slotStart('second_article');
          pageIndex.current += 1;
        } else if (pageIndex.current === 2) {
          onMainShrinkTransform(main, secondSectionRef.current);
          onRectShrinkTransform(rect);

          await sleep(time1000);
          onMainExpandTransform(main, thirdSectionRef.current);
          onRectExpandTransform(rect);

          await sleep(time500);
          slotStart('third_article');
          pageIndex.current += 1;
        } else if (pageIndex.current === 3) {
          onMainShrinkTransform(main, thirdSectionRef.current);
          onRectShrinkTransform(rect);

          await sleep(time1000);
          onMainProfileTransform(main, fourSectionRef.current);
          onRectProfileTransform(rect);

          await sleep(time1000);
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
          onMainExpandTransform(main, firstSectionRef.current);
          onRectExpandTransform(rect);

          await sleep(time500);
          slotStart('first_article');
          pageIndex.current -= 1;
        } else if (pageIndex.current === 3) {
          onMainShrinkTransform(main, thirdSectionRef.current);
          onRectShrinkTransform(rect);

          await sleep(time1000);
          onMainExpandTransform(main, secondSectionRef.current);
          onRectExpandTransform(rect);

          await sleep(time500);
          slotStart('second_article');
          pageIndex.current -= 1;
        } else if (pageIndex.current === 4) {
          onMainRemoveProfileTransform(main, fourSectionRef.current);
          onRectLastTransform(rect);

          onRectRemoveLastTransform(rect);
          onRectRemoveProfileTransform(rect);

          await sleep(time500);
          onRectExpandTransform(rect);
          onMainExpandTransform(main, thirdSectionRef.current);

          await sleep(time1000);

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
