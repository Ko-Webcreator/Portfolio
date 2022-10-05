import { useEffect } from 'react';

import { PageHead } from '@/components/common/PageHead';
import * as styles from '@/styles/index';

import type { NextPage } from 'next';

type PositionColor = {
  blue: number;
  green: number;
  red: number;
  x: number;
  y: number;
};

const Home: NextPage = () => {
  useEffect(() => {
    const draftCanvas = document.getElementById('draft')! as HTMLCanvasElement;
    const canvas = document.getElementById('header')! as HTMLCanvasElement;

    draftCanvas.width = window.innerWidth;
    draftCanvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (draftCanvas.getContext && canvas.getContext) {
      const draftCtx = draftCanvas.getContext('2d') as CanvasRenderingContext2D;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const img = new Image(); // 新たな img 要素を作成
      img.src = 'me.png';

      img.addEventListener(
        'load',
        function () {
          /*
            image配置
          **/
          const imageWidth = 700;
          const imageHeight = imageWidth * 1.11; // 比率
          const imageX = window.innerWidth - imageWidth;
          const imageY = window.innerHeight - imageHeight;
          draftCtx.drawImage(img, imageX, imageY, imageWidth, imageHeight);

          const imageData = draftCtx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.putImageData(imageData, 0, 0); // draft からコピーしたイメージデータを描画する ctx に持ってくる

          // 参考 https://stackoverflow.com/questions/13660723/get-x-and-y-pixel-coordinates-when-iterating-over-html5-canvas-getimagedata
          // ctx から 色と位置を保存する
          const positionColors: PositionColor[] = [];
          const data = imageData.data;
          for (var i = data.length; i >= 0; i -= 4) {
            if (data[i + 3] > 0) {
              const red = imageData.data[i];
              const green = imageData.data[i + 1];
              const blue = imageData.data[i + 2];
              if (red === 0 && green === 0 && blue === 0) return; //何も色がない所は表示しない
              const rgba = `rgba(${red}, ${green}, ${blue})`;
              console.log(rgba);
              var x = (i / 4) % imageData.width;
              var y = Math.floor(i / 4 / imageData.width);
              const xy = `x: ${x},y: ${y}`;
              console.log(xy);

              positionColors.push({
                blue,
                green,
                red,
                x,
                y,
              });
            }
          }
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
