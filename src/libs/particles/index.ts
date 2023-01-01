import { ISourceOptions } from 'tsparticles-engine';

// react particles
// https://github.com/matteobruni/tsparticles/tree/main/components/react

export const config = {
  particles: {
    collisions: {
      enable: true,
    },
    color: {
      value: '#ffffff',
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'bounce',
      },
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        area: 5000,
        enable: true,
      },
      value: 60,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { max: 5, min: 1 },
    },
  },
} as ISourceOptions;
