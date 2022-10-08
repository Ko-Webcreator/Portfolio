import { useEffect } from 'react';

import { PageHead } from '@/components/common/PageHead';
import * as styles from '@/styles/index';

import type { NextPage } from 'next';

type DotColorPosition = {
  alpha: number;
  blue: number;
  green: number;
  red: number;
  x: number;
  y: number;
};
type DotSizePosition = {
  size: number;
  x: number;
  y: number;
};

type UpDownFlag = 'up' | 'down' | 'end';
type tweenInfo = {
  endX: number;
  endY: number;
  startX: number;
  startY: number;
  upDownFlagX?: UpDownFlag;
  upDownFlagY?: UpDownFlag;
};

const Home: NextPage = () => {
  useEffect(() => {
    const draftCanvas = document.getElementById('draft')! as HTMLCanvasElement;
    const canvas = document.getElementById('header')! as HTMLCanvasElement;

    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    draftCanvas.width = displayWidth;
    draftCanvas.height = displayHeight;
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    if (draftCanvas.getContext && canvas.getContext) {
      const draftCtx = draftCanvas.getContext('2d') as CanvasRenderingContext2D;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const img = new Image(); // 新たな img 要素を作成
      img.src = 'me.png';

      img.addEventListener(
        'load',
        function () {
          /*
            参考
            https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
            https://stackoverflow.com/questions/13660723/get-x-and-y-pixel-coordinates-when-iterating-over-html5-canvas-getimagedata
            ctx から 色と位置を保存する
          **/
          // 人のコピー
          const imageWidth = 700;
          const imageHeight = imageWidth * 1.11; // 比率
          const imageX = displayWidth - imageWidth;
          const imageY = displayHeight - imageHeight;
          draftCtx.drawImage(img, imageX, imageY, imageWidth, imageHeight);

          const personData = draftCtx.getImageData(0, 0, canvas.width, canvas.height);
          const personDotColorPositions: DotColorPosition[] = [];

          for (var i = personData.data.length; i >= 0; i -= 4) {
            const red = personData.data[i];
            const green = personData.data[i + 1];
            const blue = personData.data[i + 2];
            const alpha = personData.data[i + 3] / 255;

            if (red === 0 && green === 0 && blue === 0) continue; //何も色がない所は表示しない

            const x = (i / 4) % personData.width;
            const y = Math.floor(i / 4 / personData.width);
            const defaultDotColorPosition: DotColorPosition = {
              alpha,
              blue,
              green,
              red,
              x,
              y,
            };

            personDotColorPositions.push(defaultDotColorPosition);
          }

          // image clear
          draftCtx.clearRect(0, 0, displayWidth, displayHeight);

          // 文字のコピー
          const fontSize = 150;
          draftCtx.font = `${fontSize}px Arial Black, sans-serif`;
          draftCtx.fillStyle = 'red';
          draftCtx.fillText('Ko', displayWidth / 2 - 400, displayHeight / 2);
          draftCtx.fillText('Portfolio', displayWidth / 2 - 400, displayHeight / 2 + fontSize);

          const headlineData = draftCtx.getImageData(0, 0, canvas.width, canvas.height);
          const headlineDotColorPositions: DotColorPosition[] = [];

          for (var i = headlineData.data.length; i >= 0; i -= 4) {
            const red = headlineData.data[i];
            const green = headlineData.data[i + 1];
            const blue = headlineData.data[i + 2];
            const alpha = headlineData.data[i + 3] / 255;

            if (red === 0 && green === 0 && blue === 0) continue; //何も色がない所は表示しない

            const x = (i / 4) % headlineData.width;
            const y = Math.floor(i / 4 / headlineData.width);
            const defaultDotColorPosition: DotColorPosition = {
              alpha,
              blue,
              green,
              red,
              x,
              y,
            };

            // const rgba = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
            // ctx.fillStyle = rgba;
            // ctx.fillRect(x, y, 1, 1);

            headlineDotColorPositions.push(defaultDotColorPosition);
          }

          // latter clear
          draftCtx.clearRect(0, 0, displayWidth, displayHeight);
          const copyHeadlineDotColorPositions = [...headlineDotColorPositions];

          // // 文字のアニメーション
          let loopTextCount = 0;
          const headLineTweenInfo: tweenInfo[] = [];

          const getRandomArbitrary = (max: number, min: number) => {
            return Math.floor(Math.random() * (max - min) + min);
          };

          const textDots = () => {
            const moveAnimation = (
              endX: number,
              endY: number,
              startX: number,
              startY: number,
              upDownFlagX?: UpDownFlag,
              upDownFlagY?: UpDownFlag,
            ) => {
              const speed = 10;

              // if (i === 0) {
              //   // 最初に up なのか down なのかを判定する
              //   if (endX > startX) {
              //     upDownFlagX = 'up';
              //   } else {
              //     upDownFlagX = 'down';
              //   }
              //   // 最初に up なのか down なのかを判定する
              //   if (endY > startY) {
              //     upDownFlagY = 'up';
              //   } else {
              //     upDownFlagY = 'down';
              //   }
              // }

              if (upDownFlagX === 'up' && endX >= startX) {
                // up の場合
                startX += speed;
              } else if (upDownFlagX === 'down' && endX <= startX) {
                // downの場合
                startX -= speed;
              } else {
                // それ以外の場合は該当ポジションまで移動してるので終了flag にする
                upDownFlagX = 'end';
              }

              if (upDownFlagY === 'up' && endY >= startY) {
                // up の場合
                startY += speed;
              } else if (upDownFlagY === 'down' && endY <= startY) {
                // downの場合
                startY -= speed;
              } else {
                // それ以外の場合は該当ポジションまで移動してるので終了flag にする
                upDownFlagY = 'end';
              }

              return {
                startX,
                startY,
                upDownFlagX,
                upDownFlagY,
              };
            };

            for (let i = 0; i < copyHeadlineDotColorPositions.length; i++) {
              if (i % 5 !== 0) continue; // 5の倍数ぐらいが速度が丁度良い

              const size = 1;
              const betweenSize = 2;

              const startX = headLineTweenInfo[i]
                ? headLineTweenInfo[i].startX
                : copyHeadlineDotColorPositions[i].x;
              const startY = headLineTweenInfo[i]
                ? headLineTweenInfo[i].startY
                : copyHeadlineDotColorPositions[i].y;

              const endX = headLineTweenInfo[i]
                ? headLineTweenInfo[i].endX
                : getRandomArbitrary(startX - betweenSize, startX + betweenSize);
              const endY = headLineTweenInfo[i]
                ? headLineTweenInfo[i].endY
                : getRandomArbitrary(startY - betweenSize, startY + betweenSize);

              const prevUpDownFlagX = headLineTweenInfo[i]
                ? headLineTweenInfo[i].upDownFlagX
                : startX < endX
                ? 'up'
                : 'down';

              const prevUpDownFlagY = headLineTweenInfo[i]
                ? headLineTweenInfo[i].upDownFlagY
                : startY < endY
                ? 'up'
                : 'down';

              // 前の描画を削除
              if (loopTextCount > 0) {
                // 位置(x,y)軸から -1 ずらし、外枠(1,1)を含めて3の範囲を消す
                ctx.clearRect(startX - 1, startY - 1, size + 2, size + 2);
              }

              // 次のXとYの位置を計算する
              const {
                upDownFlagX,
                upDownFlagY,
                startX: nextX,
                startY: nextY,
              } = moveAnimation(endX, endY, startX, startY, prevUpDownFlagX, prevUpDownFlagY);

              // 描画
              const r = 255;
              const g = 255;
              const b = 255;
              const alpha = copyHeadlineDotColorPositions[i].alpha;
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              ctx.fillRect(nextX, nextY, size, size);

              // xとYの位置への移動が完了した時は、新しい移動位置を設定する
              if (upDownFlagX === 'end' && upDownFlagY === 'end') {
                if (loopTextCount % 2 === 0) {
                  // 画面内で自由な位置に移動
                  headLineTweenInfo[i] = {
                    endX: getRandomArbitrary(nextX - betweenSize, nextX + betweenSize),
                    endY: getRandomArbitrary(nextY - betweenSize, nextY + betweenSize),
                    startX: nextX,
                    startY: nextY,
                    upDownFlagX: nextX < headlineDotColorPositions[i].x ? 'up' : 'down',
                    upDownFlagY: nextY < headlineDotColorPositions[i].y ? 'up' : 'down',
                  };
                } else {
                  // 文字列に一旦戻る
                  headLineTweenInfo[i] = {
                    endX: headlineDotColorPositions[i].x,
                    endY: headlineDotColorPositions[i].y,
                    startX: nextX,
                    startY: nextY,
                    upDownFlagX: nextX < headlineDotColorPositions[i].x ? 'up' : 'down',
                    upDownFlagY: nextY < headlineDotColorPositions[i].y ? 'up' : 'down',
                  };
                }
              } else {
                // flag は維持
                headLineTweenInfo[i] = {
                  endX,
                  endY,
                  startX: nextX,
                  startY: nextY,
                  upDownFlagX,
                  upDownFlagY,
                };
              }
            }
            loopTextCount += 1;

            requestAnimationFrame(textDots);
          };

          textDots();

          const copyPersonDotColorPositions = [...personDotColorPositions];
          copyPersonDotColorPositions.length = 1000;

          const imgDots = () => {
            for (let i = 0; i < copyPersonDotColorPositions.length; i++) {
              if (i === 0) continue;

              let x = getRandomArbitrary(0, displayWidth);
              const y = getRandomArbitrary(0, displayHeight);

              // 描画
              const dotSize = getRandomArbitrary(0, 10);
              const red = getRandomArbitrary(0, 255);
              const green = getRandomArbitrary(0, 255);
              const blue = getRandomArbitrary(0, 255);
              const alpha = copyPersonDotColorPositions[i].alpha;
              ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
              ctx.fillRect(x, y, dotSize, dotSize);
            }
          };

          // imgDots();
        },
        false,
      );
    }
  }, []);

  return (
    <>
      <PageHead description="Ko Portfolio" />

      <h2 className={styles.leftFixed}>Portfolio</h2>
      <header className={styles.header}>
        <h1>
          Ko
          <br />
          Portfolio
        </h1>
        <canvas className="draft" id="draft"></canvas>
        <canvas id="header"></canvas>
      </header>
    </>
  );
};

export default Home;
