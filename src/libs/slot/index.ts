export const slotStart = (id: string) => {
  const targetId = document.getElementById(id)!;
  const slots = targetId.querySelectorAll('[data-slot]');

  slots.forEach((element: any) => {
    const str = element.dataset['slot'];
    let time = 300;

    // 文字数に応じて time を変更する
    if (str.length <= 50 && str.length > 10) {
      time = 20;
    }
    if (str.length <= 100 && str.length > 50) {
      time = 10;
    }
    if (str.length > 100) {
      time = 5;
    }

    slotAnimation(element, str, time);
  });
};

const getRandomArbitrary = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);

const slotAnimation = (element: any, str: string, time: number) => {
  const words = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  let textCount = 0;
  let requestAnimationID = 0;
  const textLength = str.length;
  const text = str;

  const parseWords = (str = '') => {
    const index = getRandomArbitrary(0, words.length);

    element.innerHTML = str + words[index];

    requestAnimationID = requestAnimationFrame(() => parseWords(str));
  };

  const repeatText = () => {
    cancelAnimationFrame(requestAnimationID);

    if (textCount < textLength) {
      const str = text.slice(0, textCount);
      parseWords(str);
      textCount += 1;

      setTimeout(() => {
        repeatText();
      }, time);
    } else {
      element.innerHTML = text;
    }
  };

  repeatText();
};
