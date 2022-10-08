import { css } from '@emotion/css';

const zIndex = 20;

export const leftFixed = css`
  position: fixed;
  left: 0;
  top: 0;
  font-size: 20rem;
  z-index: 0;
  color: var(--white);
  writing-mode: vertical-rl;
  opacity: 0.5;
  text-indent: -40px;
`;

export const header = css`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${zIndex};
  width: 100%;
  height: 100%;
  margin-left: -50px;
  background: var(--black);

  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;

    // &.draft {
    //   z-index: -1;
    //   opacity: 0;
    // }
  }

  h1 {
    font-size: 10rem;
    display: none;
  }
`;
