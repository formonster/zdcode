import { useState, useEffect } from 'react';

const getPostion = (
  e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  // @ts-ignore
  if (e.pageX) {
    // @ts-ignore
    const { pageX, pageY } = e;
    return { x: pageX, y: pageY };
  }
  // @ts-ignore
  if (e.nativeEvent.pageX) {
    // @ts-ignore
    const { pageX, pageY } = e.nativeEvent;
    return { x: pageX, y: pageY };
  }
  // @ts-ignore
  if (e.nativeEvent.changedTouches) {
    // @ts-ignore
    const { pageX, pageY } = e.nativeEvent.changedTouches[0];
    return { x: pageX, y: pageY };
  }
  return { x: 0, y: 0 };
};

export type UseTouchEvent = {
  event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>;
  first: boolean;
  down: boolean;
  movement: number[];
  lastOffset: number[];
  cancel: () => void;
};

export type UseTouchBind = {
  onTouchStart: React.TouchEventHandler<HTMLDivElement>;
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  onTouchMove: React.TouchEventHandler<HTMLDivElement>;
  onMouseMove: React.MouseEventHandler<HTMLDivElement>;
  onTouchEnd: React.TouchEventHandler<HTMLDivElement>;
  onMouseUp: React.MouseEventHandler<HTMLDivElement>;
};

export const useTouch = (callback: (event: UseTouchEvent) => void) => {
  const [down, setDown] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [lastOffset, setLastOffset] = useState<number[]>([0, 0]);
  const [startPostion, setStartPostion] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const cancel = () => {
    setDown(false);
    setIsCancel(true);
  };

  const onTouchMove:
    | React.TouchEventHandler<HTMLDivElement>
    | React.MouseEventHandler<HTMLDivElement> = e => {
    if (!down || isCancel) return;
    const { x, y } = getPostion(e);
    
    callback({
      event: e,
      first: false,
      down: true,
      movement: [x - startPostion.x, y - startPostion.y],
      cancel,
      lastOffset,
    });
  };

  const onTouchStart:
    | React.TouchEventHandler<HTMLDivElement>
    | React.MouseEventHandler<HTMLDivElement> = e => {
    const { x, y } = getPostion(e);
    setStartPostion({ x, y });
    setDown(true);
    callback({
      event: e,
      first: true,
      down: true,
      movement: [0, 0],
      cancel,
      lastOffset,
    });
  };

  const onTouchEnd:
    | React.TouchEventHandler<HTMLDivElement>
    | React.MouseEventHandler<HTMLDivElement> = e => {
    const { x, y } = getPostion(e);
    setLastOffset([lastOffset[0] + x - startPostion.x, lastOffset[1] + y - startPostion.y]);
    if (down)
      callback({
        event: e,
        first: false,
        down: false,
        movement: [x - startPostion.x, y - startPostion.y],
        cancel,
        lastOffset,
      });
    setDown(false);
    setIsCancel(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', onTouchMove)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('mouseup', onTouchEnd)
    document.addEventListener('touchend', onTouchEnd)

    return () => {
      document.removeEventListener('mousemove', onTouchMove)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('mouseup', onTouchEnd)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [down, isCancel, lastOffset, startPostion])

  return {
    onTouchStart,
    onMouseDown: onTouchStart,
  } as UseTouchBind;
};
