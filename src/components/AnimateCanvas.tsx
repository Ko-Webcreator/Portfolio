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

const AnimateCanvas = () => {
  useEffect(() => {
    const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // set windowSize
    let displayWidth = window.innerWidth;
    let displayHeight = window.innerHeight;

    // breakpoints
    const spBreakpoints = 920;

    //vw計算
    const get_vw = (size: number, viewport = 375) => {
      const rate = 100 / viewport;
      return rate * size * (displayWidth / 100);
    };

    const canvasEvent = () => {
      canvas.width = displayWidth;
      canvas.height = displayHeight;

      // const source = [{ name: 'me', src: 'me.png' }];
      // const images: { name: string; obj: HTMLImageElement }[] = [];
      // source.forEach((_, i) => {
      //   images[i] = {
      //     name: source[i].name,
      //     obj: new Image(),
      //   };
      //   images[i].obj.src = source[i].src;
      // });

      // images.forEach((e, i) => {
      //   e.obj.addEventListener(
      //     'load',
      //     () => {
      //       if (i === source.length - 1) {
      //         loaded();
      //       }
      //     },
      //     false,
      //   );
      // });

      const loaded = () => {
        /*
            参考
            https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
            https://stackoverflow.com/questions/13660723/get-x-and-y-pixel-coordinates-when-iterating-over-html5-canvas-getimagedata
            https://codepen.io/mouseroot/pen/XWWbgz
            ctx から 色と位置を保存する
         **/
        // 人のコピー
        // const nameImg = images.find((e) => (e.name = 'me'))!;
        // const imageWidth = 700;
        // const imageHeight = imageWidth * 1.11; // 比率
        // const imageX = displayWidth - imageWidth;
        // const imageY = displayHeight - imageHeight;
        // ctx.drawImage(nameImg.obj, imageX, imageY, imageWidth, imageHeight);

        // const personData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // const personDotColorPositions: DotColorPosition[] = [];

        // for (var i = personData.data.length; i >= 0; i -= 4) {
        //   const red = personData.data[i];
        //   const green = personData.data[i + 1];
        //   const blue = personData.data[i + 2];
        //   const alpha = personData.data[i + 3] / 255;

        //   if (red === 0 && green === 0 && blue === 0) continue; //何も色がない所は表示しない

        //   const x = (i / 4) % personData.width;
        //   const y = Math.floor(i / 4 / personData.width);
        //   const defaultDotColorPosition: DotColorPosition = {
        //     alpha,
        //     blue,
        //     green,
        //     red,
        //     x,
        //     y,
        //   };

        //   personDotColorPositions.push(defaultDotColorPosition);
        // }

        // // 画像をクリア
        // ctx.clearRect(0, 0, displayWidth, displayHeight);

        // 文字のコピー
        let fontSize = 120;
        if (window.innerWidth <= spBreakpoints) {
          fontSize = get_vw(60);
        }
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = 'red';
        if (displayWidth <= spBreakpoints) {
          const left = 135;
          ctx.fillText('Ko', displayWidth / 2 - get_vw(left), displayHeight / 2 - get_vw(12));
          ctx.fillText(
            'Portfolio',
            displayWidth / 2 - get_vw(left),
            displayHeight / 2 + get_vw(50),
          );
        } else {
          const left = 270;
          const top = 20;
          ctx.fillText('Ko', displayWidth / 2 - left, displayHeight / 2 - top);
          ctx.fillText('Portfolio', displayWidth / 2 - left, displayHeight / 2 + fontSize - top);
        }

        const headlineData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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

        // 文字をクリア
        ctx.clearRect(0, 0, displayWidth, displayHeight);

        /*
            文字
        　**/
        const size = 1;
        const copyHeadlineColorPositions = [...headlineDotColorPositions];
        const textDots = () => {
          for (let i = 0; i < copyHeadlineColorPositions.length; i++) {
            // 描画
            const x = copyHeadlineColorPositions[i].x;
            const y = copyHeadlineColorPositions[i].y;
            const r = 255;
            const g = 255;
            const b = 255;
            const alpha = copyHeadlineColorPositions[i].alpha;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.fillRect(x, y, size, size);
            // ctx.clearRect(x, y, size, size);
          }
        };
        textDots();
      };
    };

    canvasEvent();

    window.addEventListener('resize', () => {
      // clearInterval(clearID);
      displayWidth = window.innerWidth;
      displayHeight = window.innerHeight;
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      canvasEvent();
    });
  }, []);

  return (
    <>
      <canvas className={`${styles.canvas}`} id="canvas" />
    </>
  );
};

export default AnimateCanvas;
