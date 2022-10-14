import * as PIXI from 'pixi.js';
import { useEffect } from 'react';

import styles from '@/styles/components/AnimateCanvas.module.scss';

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

const AnimateCanvas = () => {
  useEffect(() => {
    const upCanvas = document.getElementById('up')! as HTMLCanvasElement;
    const middleCanvas = document.getElementById('middle')! as HTMLCanvasElement;
    const underCanvas = document.getElementById('under')! as HTMLCanvasElement;
    const upCtx = upCanvas.getContext('2d') as CanvasRenderingContext2D;
    const middleCtx = middleCanvas.getContext('2d') as CanvasRenderingContext2D;

    // set windowSize
    let displayWidth = window.innerWidth;
    let displayHeight = window.innerHeight;

    // breakpoints
    const spBreakpoints = 820;

    const canvasEvent = () => {
      upCanvas.width = displayWidth;
      upCanvas.height = displayHeight;
      middleCanvas.width = displayWidth;
      middleCanvas.height = displayHeight;

      //set PixiJS
      const underApp = new PIXI.Application({
        antialias: true,
        backgroundAlpha: 0,
        height: displayHeight,
        resolution: window.devicePixelRatio || 1,
        view: underCanvas,
        width: displayWidth,
      });

      const source = [
        { name: 'me', src: 'me.png' },
        { name: 'head', src: 'head.jpg' },
      ];
      const images: { name: string; obj: HTMLImageElement }[] = [];
      source.forEach((_, i) => {
        images[i] = {
          name: source[i].name,
          obj: new Image(),
        };
        images[i].obj.src = source[i].src;
      });

      images.forEach((e, i) => {
        e.obj.addEventListener(
          'load',
          () => {
            if (i === source.length - 1) {
              loaded();
            }
          },
          false,
        );
      });

      const get_vw = (size: number, viewport = 375) => {
        const rate = 100 / viewport;
        return rate * size * (displayWidth / 100);
      };

      const loaded = () => {
        console.log('loaded');

        /*
            参考
            https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
            https://stackoverflow.com/questions/13660723/get-x-and-y-pixel-coordinates-when-iterating-over-html5-canvas-getimagedata
            https://codepen.io/mouseroot/pen/XWWbgz
            ctx から 色と位置を保存する
         **/
        // 人のコピー
        const nameImg = images.find((e) => (e.name = 'me'))!;
        const imageWidth = 700;
        const imageHeight = imageWidth * 1.11; // 比率
        const imageX = displayWidth - imageWidth;
        const imageY = displayHeight - imageHeight;
        upCtx.drawImage(nameImg.obj, imageX, imageY, imageWidth, imageHeight);

        const personData = upCtx.getImageData(0, 0, upCanvas.width, upCanvas.height);
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
        upCtx.clearRect(0, 0, displayWidth, displayHeight);

        // 文字のコピー
        let fontSize = 150;
        if (window.innerWidth <= spBreakpoints) {
          fontSize = get_vw(60);
        }
        upCtx.font = `bold ${fontSize}px sans-serif`;
        upCtx.fillStyle = 'red';
        if (displayWidth <= spBreakpoints) {
          upCtx.fillText('Ko', displayWidth / 2 - get_vw(165), displayHeight / 2 - get_vw(12));
          upCtx.fillText(
            'Portfolio',
            displayWidth / 2 - get_vw(165),
            displayHeight / 2 + get_vw(50),
          );
        } else {
          upCtx.fillText('Ko', displayWidth / 2 - 390, displayHeight / 2 - 20);
          upCtx.fillText('Portfolio', displayWidth / 2 - 390, displayHeight / 2 + fontSize - 20);
        }

        const headlineData = upCtx.getImageData(0, 0, upCanvas.width, upCanvas.height);
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

          headlineDotColorPositions.push(defaultDotColorPosition);
        }

        // latter clear
        upCtx.clearRect(0, 0, displayWidth, displayHeight);

        /*
          背景のアニメーション
        **/
        const headImg = images.find((e) => e.name === 'head')!;

        upCtx.drawImage(headImg.obj, 0, 0, displayWidth, displayHeight);

        const bgData = upCtx.getImageData(0, 0, upCanvas.width, upCanvas.height);
        const bgDotColorPositions: DotColorPosition[] = [];

        upCtx.clearRect(0, 0, displayWidth, displayHeight);

        for (var i = bgData.data.length; i >= 0; i -= 4) {
          const red = bgData.data[i];
          const green = bgData.data[i + 1];
          const blue = bgData.data[i + 2];
          const alpha = bgData.data[i + 3] / 255;

          if (red === 0 && green === 0 && blue === 0) continue; //何も色がない所は表示しない

          const x = (i / 4) % bgData.width;
          const y = Math.floor(i / 4 / bgData.width);
          const defaultDotColorPosition: DotColorPosition = {
            alpha,
            blue,
            green,
            red,
            x,
            y,
          };

          const rgba = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
          upCtx.fillStyle = rgba;
          upCtx.fillRect(x, y, 1, 1);

          bgDotColorPositions.push(defaultDotColorPosition);
        }

        /*
            文字
        　**/
        const copyHeadlineColorPositions = [...headlineDotColorPositions];

        const textDots = () => {
          // box size
          let size = 1;

          for (let i = 0; i < copyHeadlineColorPositions.length; i++) {
            // 描画
            const x = copyHeadlineColorPositions[i].x;
            const y = copyHeadlineColorPositions[i].y;
            const r = 255;
            const g = 255;
            const b = 255;
            const alpha = copyHeadlineColorPositions[i].alpha;
            upCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            upCtx.fillRect(x, y, size, size);
          }
        };
        textDots();
      };
    };

    canvasEvent();

    window.addEventListener('resize', () => {
      upCtx.clearRect(0, 0, underCanvas.width, underCanvas.height);
      displayWidth = window.innerWidth;
      displayHeight = window.innerHeight;
      canvasEvent();
    });
  }, []);

  return (
    <>
      <canvas className={`${styles.canvas} ${styles.up}`} id="up" />
      <canvas className={`${styles.canvas} ${styles.middle}`} id="middle" />
      <canvas className={`${styles.canvas} ${styles.under}`} id="under" />
    </>
  );
};

export default AnimateCanvas;
