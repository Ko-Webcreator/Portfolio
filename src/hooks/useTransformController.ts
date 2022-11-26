import { MutableRefObject, useCallback } from 'react';

import MainStyles from '@/styles/Main.module.scss';
import RectStyles from '@/styles/Rect.module.scss';

export const useTransformController = () => {
  const onMainExpandedTransform = useCallback((main: MutableRefObject<HTMLElement>) => {
    main.current.classList.remove(MainStyles.shrink);
    main.current.classList.add(MainStyles.expand);
  }, []);

  const onMainShrinkTransform = useCallback((main: MutableRefObject<HTMLElement>) => {
    main.current.classList.add(MainStyles.shrink);
    main.current.classList.remove(MainStyles.expand);
  }, []);

  const onRectExpandedTransform = useCallback((rect: MutableRefObject<HTMLElement>) => {
    rect.current.classList.remove(RectStyles.shrink);
    rect.current.classList.add(RectStyles.expand);
  }, []);

  const onRectShrinkTransform = useCallback((rect: MutableRefObject<HTMLElement>) => {
    rect.current.classList.add(RectStyles.shrink);
    rect.current.classList.remove(RectStyles.expand);
  }, []);

  return {
    onMainExpandedTransform,
    onMainShrinkTransform,
    onRectExpandedTransform,
    onRectShrinkTransform,
  };
};
