import { ISourceOptions } from 'tsparticles-engine';

// react particles
// https://github.com/matteobruni/tsparticles/tree/main/components/react

export const config = {
  fpsLimit: 60,
  interactivity: {
    events: {
      resize: true,
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 20,
        duration: 0.4,
      },
    },
  },
  particles: {
    collisions: {
      enable: true,
    },
    color: {
      value: '#ffffff',
    },
    links: {
      color: '#ff00000',
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
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
        area: 10000,
        enable: true,
      },
      value: 80,
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
