import { MutableRefObject, useCallback } from 'react';

import MainStyles from '@/styles/Main.module.scss';
import RectStyles from '@/styles/Rect.module.scss';

export const useTransformController = () => {
  const onMainExpandedTransform = useCallback(
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

  const onRectExpandedTransform = useCallback((rect: MutableRefObject<HTMLElement>) => {
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

  return {
    onMainExpandedTransform,
    onMainShrinkTransform,
    onRectExpandedTransform,
    onRectFirstShrinkTransform,
    onRectRemoveShrinkTransform,
    onRectShrinkTransform,
  };
};
