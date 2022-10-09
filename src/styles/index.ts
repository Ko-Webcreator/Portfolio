import { css } from '@emotion/css';

export const leftFixed = css`
  position: fixed;
  left: 0;
  top: 0;
  font-size: 20rem;
  z-index: 100;
  color: var(--white);
  writing-mode: vertical-rl;
  opacity: 0.5;
  text-indent: -40px;
`;

export const horizontalLine = css`
  width: 50%;
  height: 10px;
  position: absolute;
  right: 0;
  bottom: 100px;
  z-index: 20;

  &::before {
    content: '';
    width: 100%;
    height: 100%;
    background-image: linear-gradient(var(--rotate), rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    animation: spin 3s linear infinite;
  }

  &::after {
    content: '';
    width: 100%;
    height: calc(100% - 5px);
    position: absolute;
    left: 0;
    top: 0;
    background: var(--black);
  }

  @keyframes spin {
    0% {
      --rotate: 0deg;
    }
    100% {
      --rotate: 360deg;
    }
  }

  @property --rotate {
    syntax: '<angle>';
    initial-value: 132deg;
    inherits: false;
  }
`;

export const verticalLine = css`
  display: flex;
  justify-content: end;
  flex-direction: column;
  align-items: end;
  width: 400px;
  height: 90%;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 10;
  transform: rotateY(190deg);
  padding-bottom: 200px;

  &::before {
    content: '';
    width: 100%;
    height: 100%;
    background-image: linear-gradient(var(--rotate), rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    animation: spin 2.5s linear infinite;
  }

  &::after {
    content: '';
    width: calc(100% - 5px);
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: var(--black);
  }

  li {
    color: var(--white);
    font-size: 34px;
    z-index: 10;
    position: relative;
    padding-right: 40px;

    &.on {
      animation: color-change 3s ease-in infinite reverse;
    }

    & ~ li {
      margin-top: 10px;
    }
  }

  @keyframes color-change {
    0% {
      color: rgb(247, 93, 139);
    }
    100% {
      color: rgb(254, 220, 64);
    }
  }
`;

export const header = css`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  width: 100%;
  height: 100%;
  background: var(--black);

  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;
    z-index: 20;

    // &.draft {
    //   z-index: -1;
    //   opacity: 0;
    // }
  }

  h1 {
    font-size: 150px;
    color: var(--white);
    position: relative;
    left: -100px;
    top: 10px;
    // animation: color-change 3s ease-in infinite reverse;
  }
`;
