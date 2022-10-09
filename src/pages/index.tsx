import { useEffect } from 'react';

import { PageHead } from '@/components/common/PageHead';
import { Github } from '@/components/svg/Github';
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

type UpDownFlag = 'up' | 'down' | 'end';
type tweenInfo = {
  endX: number;
  endY: number;
  loopFlag: number;
  startX: number;
  startY: number;
  upDownFlagX: UpDownFlag;
  upDownFlagY: UpDownFlag;
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
            https://codepen.io/mouseroot/pen/XWWbgz
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
          draftCtx.fillStyle = 'white';
          draftCtx.textAlign = 'left';
          draftCtx.fillText('Ko', displayWidth / 2 - fontSize * 3, displayHeight / 2);
          draftCtx.fillText(
            'Portfolio',
            displayWidth / 2 - fontSize * 3,
            displayHeight / 2 + fontSize,
          );

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

          /*
            文字のアニメーション
          **/
          let loopTextCount = 0;
          const headLineTweenInfo: tweenInfo[] = [];
          const copyHeadlineDotColorPositions = [...headlineDotColorPositions];
          // copyHeadlineDotColorPositions.length = 10000;
          // box size
          const size = 5;
          // アニメーション範囲
          const betweenSize = 100;
          // アニメーション速度
          let speed = 1;

          const getRandomArbitrary = (max: number, min: number) => {
            return Math.floor(Math.random() * (max - min) + min);
          };

          const textDots = () => {
            const moveAnimation = (
              startX: number,
              startY: number,
              endX: number,
              endY: number,
              upDownFlagX: UpDownFlag,
              upDownFlagY: UpDownFlag,
            ) => {
              if (upDownFlagX === 'up' && endX > startX) {
                // up の場合
                startX += speed;
              } else if (upDownFlagX === 'down' && endX < startX) {
                // downの場合
                startX -= speed;
              } else {
                // それ以外の場合は該当ポジションまで移動してるので終了flag にする
                upDownFlagX = 'end';
              }

              if (upDownFlagY === 'up' && endY > startY) {
                // up の場合
                startY += speed;
              } else if (upDownFlagY === 'down' && endY < startY) {
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
              if (i % 1500 !== 0 || copyHeadlineDotColorPositions[i].y > displayHeight - 500)
                // たまに下の方に表示されるので、それは除外する
                continue;

              const startX = headLineTweenInfo[i]
                ? headLineTweenInfo[i].startX
                : getRandomArbitrary(
                    copyHeadlineDotColorPositions[i].x - betweenSize,
                    copyHeadlineDotColorPositions[i].x + betweenSize,
                  );
              const startY = headLineTweenInfo[i]
                ? headLineTweenInfo[i].startY
                : getRandomArbitrary(
                    copyHeadlineDotColorPositions[i].y - betweenSize,
                    copyHeadlineDotColorPositions[i].y + betweenSize,
                  );

              const endX = headLineTweenInfo[i]
                ? headLineTweenInfo[i].endX
                : copyHeadlineDotColorPositions[i].x;
              const endY = headLineTweenInfo[i]
                ? headLineTweenInfo[i].endY
                : copyHeadlineDotColorPositions[i].y;

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
                ctx.clearRect(startX - 1, startY - 1, size + 3, size + 3);
              }

              // 次のXとYの位置を計算する
              const {
                upDownFlagX,
                upDownFlagY,
                startX: nextX,
                startY: nextY,
              } = moveAnimation(startX, startY, endX, endY, prevUpDownFlagX, prevUpDownFlagY);

              // 描画
              const loopFlag = headLineTweenInfo[i] ? headLineTweenInfo[i].loopFlag : 0;
              const r = getRandomArbitrary(0, 255);
              const g = getRandomArbitrary(0, 255);
              const b = getRandomArbitrary(0, 255);
              const alpha = loopTextCount < 10 ? 0 : copyHeadlineDotColorPositions[i].alpha;
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              ctx.fillRect(nextX, nextY, size, size);

              // xとYの位置への移動が完了した時は、新しい移動位置を設定する
              if (upDownFlagX === 'end' && upDownFlagY === 'end') {
                if (loopFlag % 2 === 0) {
                  // 文字列に一旦戻る
                  const endX = getRandomArbitrary(nextX - betweenSize, nextX + betweenSize);
                  const endY = getRandomArbitrary(nextY - betweenSize, nextY + betweenSize);
                  headLineTweenInfo[i] = {
                    endX: endX,
                    endY: endY,
                    loopFlag: loopFlag + 1,
                    startX: nextX,
                    startY: nextY,
                    upDownFlagX: nextX < endX ? 'up' : 'down',
                    upDownFlagY: nextY < endY ? 'up' : 'down',
                  };
                } else {
                  // betWeenSize の範囲で移動する
                  headLineTweenInfo[i] = {
                    endX: headlineDotColorPositions[i].x,
                    endY: headlineDotColorPositions[i].y,
                    loopFlag: loopFlag + 1,
                    startX: nextX,
                    startY: nextY,
                    upDownFlagX: nextX < headlineDotColorPositions[i].x ? 'up' : 'down',
                    upDownFlagY: nextY < headlineDotColorPositions[i].y ? 'up' : 'down',
                  };
                }
              } else {
                // flag は維持する
                headLineTweenInfo[i] = {
                  endX,
                  endY,
                  loopFlag: loopFlag,
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
              const red = 255;
              const green = 255;
              const blue = 255;
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
        <canvas className="draft" id="draft"></canvas>
        <canvas id="header"></canvas>
        <h1>
          Ko
          <br />
          Portfolio
        </h1>
        <div className={styles.horizontalLine} />
        <ul className={styles.verticalLine}>
          <li className="on">★</li>
          <li>☆</li>
          <li>☆</li>
          <li>☆</li>
          <li>
            <a href="https://github.com/Ko-Webcreator/Portfolio" rel="noreferrer" target="_blank">
              <Github color="inherit" size={30} />
            </a>
          </li>
        </ul>
      </header>
    </>
  );
};

export default Home;
