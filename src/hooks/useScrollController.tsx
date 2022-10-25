import { useCallback, useEffect, useRef } from 'react';

import { Log } from '@/libs/log';
import HeaderStyles from '@/styles/Header.module.scss';
type firstViewToggle = 'up' | 'down';

/**
 * scrollのコントロールを定義
 */
export const useScrollController = () => {
  const header = useRef<HTMLElement>(null!);
  const rect = useRef<HTMLDivElement>(null!);
  const pageY = useRef<HTMLDivElement>(null!);
  const main = useRef<HTMLElement>(null!);

  let isFirstScrollRef = useRef(false); //初回スクロールフラグ
  let isDownScrollingRef = useRef(false); // 下にスクロール済みか
  let translateYRef = useRef(0); // 初回スクロール位置

  // mainの長さをキリ番で計算する : 例 1234 → 1200
  const mainHeightCalculate = useCallback(() => {
    if (!main.current) return;

    let mainHeight = main.current.clientHeight;

    const mainHeightDigits = mainHeight.toString().length;
    const divide = Number('1' + '0'.repeat(mainHeightDigits - 2)); // 1234 → 100
    mainHeight = Number(
      Math.floor((mainHeight - 50) / divide).toString() + '0'.repeat(mainHeightDigits - 2),
    );
    main.current.style.height = mainHeight + 'px';
    return mainHeight;
  }, [main]);

  const scrollAnimation = useCallback(
    (position: number, range: number, toggleType: firstViewToggle) => {
      let currentPosition = 0; // スクロールする位置
      let progress = 0; // 現在の進捗 0 ～ 100
      let animationID: number;

      const easeOut = function (p: number) {
        // ease-out に当てはめた値を返す
        return p * (2 - p);
      };
      let move = function () {
        Log.debug('requestAnimationFrame');
        // 実際にスクロールを行う

        if (toggleType == 'down') {
          progress++; // 進捗を進める
          currentPosition = range * easeOut(progress / 100); // スクロールする位置を計算する
          pageY.current.style.transform = `translateY(-${currentPosition}px)`;
          main.current.style.transform = `translateY(-${currentPosition}px)`;

          if (currentPosition < range) {
            // 現在位置が目的位置より進んでいなければアニメーションを続行させる
            animationID = requestAnimationFrame(move);
          } else {
            isFirstScrollRef.current = true;
            translateYRef.current = -header.current.clientHeight;

            // 枠のアニメーション
            rect.current.classList.add(HeaderStyles.expand);
          }
        } else {
          progress++; // 進捗を進める
          currentPosition = position - position * easeOut(progress / 100); // スクロールする位置を計算する
          pageY.current.style.transform = `translateY(-${currentPosition}px)`;
          main.current.style.transform = `translateY(-${currentPosition}px)`;

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
    [isFirstScrollRef, translateYRef, header, pageY],
  );

  const scroll = useCallback(() => {
    // main の高さをあらかじめ計算
    // const mainHeight = mainHeightCalculate()!;
    const mainHeight = main.current.clientHeight;

    const speed = 50;
    window.addEventListener('wheel', (e) => {
      const deltaY = (e as WheelEvent).deltaY;
      // スクロールのコントロール
      if (deltaY > 0 && Math.abs(translateYRef.current) < mainHeight) {
        // 下スクロール
        if (!isFirstScrollRef.current && !isDownScrollingRef.current) {
          // 最初のスクロール
          isDownScrollingRef.current = true;
          scrollAnimation(0, header.current.clientHeight, 'down');
        } else if (isFirstScrollRef.current) {
          translateYRef.current -= speed;
          pageY.current.style.transform = `translateY(${translateYRef.current}px)`;
          main.current.style.transform = `translateY(${translateYRef.current}px)`;
        }
      } else if (deltaY < 0 && translateYRef.current < 0) {
        // 上スクロール
        if (
          Math.abs(translateYRef.current) < header.current.clientHeight &&
          isDownScrollingRef.current
        ) {
          // トップにスクロール
          isDownScrollingRef.current = false;
          scrollAnimation(Math.abs(translateYRef.current), 0, 'up');

          // 枠のアニメーション
          rect.current.classList.remove(HeaderStyles.expand);
        } else {
          translateYRef.current += speed;
          pageY.current.style.transform = `translateY(${translateYRef.current}px)`;
          main.current.style.transform = `translateY(${translateYRef.current}px)`;
        }
      }
    });
  }, [header, pageY, scrollAnimation]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      // リサイズ時はスクロール位置をリセットする
      // translateYRef.current = 0;
      // pageY.current.style.transform = `translateY(${translateYRef.current}px)`;
      // main.current.style.transform = `translateY(${translateYRef.current}px)`;
    });
  }, [pageY]);

  return {
    header,
    main,
    pageY,
    rect,
    scroll,
  };
};
