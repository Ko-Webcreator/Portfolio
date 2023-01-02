import { MutableRefObject, useCallback } from 'react';

import { sleep } from '@/libs/await/sleep';
import MainStyles from '@/styles/Main.module.scss';
import RectStyles from '@/styles/Rect.module.scss';

export const useTransformController = () => {
  const onMainExpandTransform = useCallback(
    (main: MutableRefObject<HTMLElement>, section: HTMLElement) => {
      main.current.classList.add(MainStyles.expand);
      section.classList.add(MainStyles.expand);
    },
    [],
  );

  const onMainShrinkTransform = useCallback(
    (main: MutableRefObject<HTMLElement>, section: HTMLElement) => {
      main.current.classList.remove(MainStyles.expand);
      section.classList.remove(MainStyles.expand);
    },
    [],
  );

  const onMainProfileTransform = useCallback(
    async (main: MutableRefObject<HTMLElement>, section: HTMLElement, arrow: HTMLDivElement) => {
      main.current.classList.add(MainStyles.profile);
      arrow.classList.add(RectStyles.up);

      await sleep(1000);

      section.classList.add(MainStyles.expand);
    },
    [],
  );

  const onMainRemoveProfileTransform = useCallback(
    async (main: MutableRefObject<HTMLElement>, section: HTMLElement, arrow: HTMLDivElement) => {
      main.current.classList.remove(MainStyles.profile);
      section.classList.remove(MainStyles.expand);
      arrow.classList.remove(RectStyles.up);
    },
    [],
  );

  const onRectExpandTransform = useCallback((rect: MutableRefObject<HTMLElement>) => {
    rect.current.classList.remove(RectStyles.shrink);
    rect.current.classList.add(RectStyles.expand);
  }, []);

  const onRectFirstShrinkTransform = useCallback((rect: MutableRefObject<HTMLElement>) => {
    rect.current.classList.add(RectStyles.firstShrink);
    rect.current.classList.remove(RectStyles.expand);
  }, []);

  const onRectRemoveShrinkTransform = useCallback((rect: MutableRefObject<HTMLElement>) => {
    rect.current.classList.remove(RectStyles.firstShrink);
  }, []);

  const onRectShrinkTransform = useCallback((rect: MutableRefObject<HTMLElement>) => {
    rect.current.classList.add(RectStyles.shrink);
    rect.current.classList.remove(RectStyles.expand);
  }, []);

  const onRectProfileTransform = useCallback((rect: MutableRefObject<HTMLElement>) => {
    rect.current.classList.add(RectStyles.profile);
    rect.current.classList.remove(RectStyles.shrink);
  }, []);

  const onRectRemoveProfileTransform = useCallback((rect: MutableRefObject<HTMLElement>) => {
    rect.current.classList.add(RectStyles.shrink);
    rect.current.classList.remove(RectStyles.profile);
  }, []);

  const onRectLastTransform = useCallback((rect: MutableRefObject<HTMLElement>) => {
    rect.current.style.bottom = '0';
    rect.current.style.width = '0';
    rect.current.style.height = '0';
    rect.current.style.opacity = '0';
  }, []);

  const onRectRemoveLastTransform = useCallback((rect: MutableRefObject<HTMLElement>) => {
    rect.current.style.bottom = '';
    rect.current.style.width = '';
    rect.current.style.height = '';
    rect.current.style.opacity = '';
  }, []);

  return {
    onMainExpandTransform,
    onMainProfileTransform,
    onMainRemoveProfileTransform,
    onMainShrinkTransform,
    onRectExpandTransform,
    onRectFirstShrinkTransform,
    onRectLastTransform,
    onRectProfileTransform,
    onRectRemoveLastTransform,
    onRectRemoveProfileTransform,
    onRectRemoveShrinkTransform,
    onRectShrinkTransform,
  };
};
