import { MutableRefObject, useCallback, useEffect, useRef } from 'react';

import { slotStart } from '@/libs/slot';
import { FirstViewToggle } from '@/types/FirstViewToggle';

import { useTransformController } from './useTransformController';

export const useFirstController = () => {
  const header = useRef<HTMLElement>(null!);
  const blocks = useRef<HTMLDivElement>(null!);
  const section = useRef<HTMLElement>(null!);
  const rect = useRef<HTMLDivElement>(null!);
  const secondBlock = useRef<HTMLDivElement>(null!);

  const isFirstScrollRef = useRef(false); //初回スクロールフラグ
  const isDownScrollingRef = useRef(false); // 下にスクロール済みか
  const translateYRef = useRef(0); // 初回スクロール位置
  const secondBlockHeightRef = useRef(0);
  const speed = 50;

  const {
    onMainExpandedTransform,
    onMainShrinkTransform,
    onRectExpandedTransform,
    onRectShrinkTransform,
  } = useTransformController();

  useEffect(() => {
    secondBlockHeightRef.current = secondBlock.current.clientHeight;
  }, []);

  // secondBlockの長さをキリ番で計算する : 例 1234 → 1200
  const onSecondBlockHeightCalculate = useCallback(() => {
    if (!secondBlock.current) return;

    let secondHeight = secondBlock.current.clientHeight;

    const secondHeightDigits = secondHeight.toString().length;
    const divide = Number('1' + '0'.repeat(secondHeightDigits - 2)); // 1234 → 100
    secondHeight = Number(
      Math.floor((secondHeight - 50) / divide).toString() + '0'.repeat(secondHeightDigits - 2),
    );
    secondBlock.current.style.height = secondHeight + 'px';
    return secondHeight;
  }, [secondBlock]);

  const onScrollAnimation = useCallback(
    (
      main: MutableRefObject<HTMLElement>,
      position: number,
      range: number,
      toggleType: FirstViewToggle,
    ) => {
      let currentPosition = 0; // スクロールする位置
      let progress = 0; // 現在の進捗 0 ～ 100
      let animationID: number;

      const easeOut = function (p: number) {
        // ease-out に当てはめた値を返す
        return p * (2 - p);
      };
      let move = function () {
        // 実際にスクロールを行う
        if (toggleType == 'down') {
          progress++; // 進捗を進める
          currentPosition = range * easeOut(progress / 100); // スクロールする位置を計算する
          header.current.style.transform = `translateY(-${currentPosition}px)`;
          blocks.current.style.transform = `translateY(-${currentPosition}px)`;
          secondBlock.current.style.transform = `translateY(-${currentPosition}px)`;

          if (currentPosition < range) {
            // 現在位置が目的位置より進んでいなければアニメーションを続行させる
            animationID = requestAnimationFrame(move);
          } else {
            isFirstScrollRef.current = true;
            translateYRef.current = -section.current.clientHeight;

            // 枠のアニメーション
            onMainExpandedTransform(main);
            onRectExpandedTransform(rect);
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
            isFirstScrollRef.current = false;
            translateYRef.current = range;
          }
        }
      };

      move();
    },
    [
      onMainExpandedTransform,
      onRectExpandedTransform,
      isFirstScrollRef,
      translateYRef,
      header,
      blocks,
      section,
    ],
  );

  const onFirstController = useCallback(
    (deltaY: number, main: MutableRefObject<HTMLElement>) => {
      // スクロールのコントロール
      if (deltaY > 0 && Math.abs(translateYRef.current) < secondBlockHeightRef.current) {
        // 下スクロール
        if (!isFirstScrollRef.current && !isDownScrollingRef.current) {
          // 最初のスクロール
          isDownScrollingRef.current = true;
          onScrollAnimation(main, 0, section.current.clientHeight, 'down');
          setTimeout(() => {
            slotStart('first_article');
          }, 500);
        } else if (isFirstScrollRef.current) {
          translateYRef.current -= speed;
          header.current.style.transform = `translateY(${translateYRef.current}px)`;
          blocks.current.style.transform = `translateY(${translateYRef.current}px)`;
          secondBlock.current.style.transform = `translateY(${translateYRef.current}px)`;
        }
      } else if (deltaY < 0 && translateYRef.current < 0) {
        // 上スクロール
        if (
          Math.abs(translateYRef.current) < section.current.clientHeight &&
          isDownScrollingRef.current
        ) {
          // トップにスクロール
          isDownScrollingRef.current = false;
          onScrollAnimation(main, Math.abs(translateYRef.current), 0, 'up');

          // 枠のアニメーション
          onMainShrinkTransform(main);
          onRectShrinkTransform(rect);
        } else {
          translateYRef.current += speed;
          header.current.style.transform = `translateY(${translateYRef.current}px)`;
          blocks.current.style.transform = `translateY(${translateYRef.current}px)`;
          secondBlock.current.style.transform = `translateY(${translateYRef.current}px)`;
        }
      }
    },
    [onMainShrinkTransform, onRectShrinkTransform, onScrollAnimation],
  );

  /*
   * scroll reset
   **/
  useEffect(() => {
    window.addEventListener('resize', () => {
      // リサイズ時はスクロール位置をリセットする
      // translateYRef.current = 0;
      // header.current.style.transform = `translateY(${translateYRef.current}px)`;
      // blocks.current.style.transform = `translateY(${translateYRef.current}px)`;
      // secondBlock.current.style.transform = `translateY(${translateYRef.current}px)`;
    });
  }, [header, blocks]);

  return {
    blocks,
    header,
    onFirstController,
    rect,
    secondBlock,
    section,
  };
};
