import cn from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  useEventCallback,
  useForkRef,
  useKeeper,
  useMutation,
  useResizeHook,
  useThrottle,
} from '../../hooks';
import { ScrollhostContainer } from './components/ScrollhostContainer';
import {
  EOffsetAttributes,
  EOffsetSizeAttributes,
  EScrollOffsetAttributes,
  EScrollSizeAttributes,
  ESizeAttributes,
} from './consts';
import classes from './styles.module.scss';
import { IAxes, IScrollbarProperties, TAxis } from './types';
import { ownerDocument, useDebounceRaf } from './utils';

const isAxisY = (axis: TAxis) => axis === 'y';

export const OldScrollbar = React.forwardRef<HTMLElement, IScrollbarProperties>(
  (
    {
      autoHide = false,
      children,
      className,
      contentMaxSize,
      contentRef,
      thumbMinSize = 25,
      timeout = 1000,
      ...restProperties
    },
    reference,
  ) => {
    const [hovering, setHovering] = useState(!autoHide);
    const [hoverAxis, setHoverAxis] = useState<TAxis>('y');
    const [isDragging, setDragging] = useState(false);

    /** Ссылка на wrapper */
    const wrapperReference = useRef<null | HTMLElement>(null);
    /** Разветвление рефов, чтобы отдать wrapper в ref  */
    const forkWrapperReference = useForkRef<null | HTMLElement>(
      wrapperReference,
      reference,
    );
    /** Ссылка на контейнер с контентом */
    const scrollHostReference = useRef<null | HTMLDivElement>(null);
    /** Разветвление рефов, чтобы отдать контент в contentRef  */
    const forkContentReference = useForkRef<null | HTMLElement>(
      scrollHostReference,
      contentRef,
    );
    const timerReference = useRef<null | NodeJS.Timeout>(null);

    const axes = useKeeper<IAxes<HTMLDivElement>>({
      x: {
        dragOffset: 0,
        isDrag: false,
        isOverflowing: false,
        thumb: {} as HTMLDivElement,
        thumbSize: 0,
        track: {} as HTMLDivElement,
      },
      y: {
        dragOffset: 0,
        isDrag: false,
        isOverflowing: false,
        thumb: {} as HTMLDivElement,
        thumbSize: 0,
        track: {} as HTMLDivElement,
      },
    });

    /** Функция для отмены события */
    const preventEvent = (
      event: React.MouseEvent<HTMLElement, MouseEvent> | MouseEvent,
    ) => {
      event.preventDefault();
      event.stopPropagation();
    };

    /**
     * Функция позволяет получить
     * document из враппера
     */
    const getWrapperDocument = useCallback(() => {
      const element = wrapperReference.current;

      return ownerDocument(element as HTMLElement);
    }, []);

    const hideScrollbar = () => {
      const rectX = axes.x.track?.getBoundingClientRect?.();
      const rectY = axes.y.track?.getBoundingClientRect?.();

      if (rectX) {
        axes.x.track.style.opacity = '0';
      }
      if (rectY) {
        axes.y.track.style.opacity = '0';
      }
    };

    const showScrollbars = (axis: TAxis) => {
      if (!axes[axis].isOverflowing) {
        return;
      }

      timerReference.current && clearTimeout(timerReference.current);
      axes[axis].track.style.opacity = '1';

      if (!hovering) {
        timerReference.current = setTimeout(hideScrollbar, timeout as number);
      }
    };

    const handleTrackMouseEnter = useEventCallback((axis: TAxis) => {
      autoHide && !hovering && setHovering(true);
      autoHide && setHoverAxis(axis);
    });

    const handleWrapperMouseEnter = useEventCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        preventEvent(event);
        if (!scrollHostReference?.current) {
          return;
        }

        showScrollbars('x');
        showScrollbars('y');

        if (event.target === axes.x.track) {
          handleTrackMouseEnter('x');
        }
        if (event.target === axes.y.track) {
          handleTrackMouseEnter('y');
        }
      },
    );

    const handleWrapperMouseLeave = useEventCallback(() => {
      timerReference.current && clearTimeout(timerReference.current);
      timerReference.current = setTimeout(hideScrollbar, timeout as number);
    });

    const handleTrackMouseLeave = useEventCallback(() => {
      autoHide && hovering && setHovering(false);
    });

    const handleDocumentMouseUp = useCallback(
      (event: MouseEvent): void => {
        if (!scrollHostReference) {
          return;
        }
        if (isDragging) {
          preventEvent(event);
          setDragging(false);
          axes.x.isDrag = false;
          axes.y.isDrag = false;
        }
      },
      [axes.x, axes.y, isDragging],
    );

    const handleDocumentMouseMove = useCallback(
      (event: MouseEvent): void => {
        if (!scrollHostReference) {
          return;
        }
        if (isDragging) {
          preventEvent(event);
          const scrollHostElement =
            scrollHostReference.current || ({} as HTMLDivElement);
          const { offsetHeight, offsetWidth, scrollHeight, scrollWidth } =
            scrollHostElement;
          const hostRect = wrapperReference.current?.getBoundingClientRect();
          const draggedAxis = axes.y.isDrag ? 'y' : 'x';
          const { dragOffset, thumbSize, track } = axes[draggedAxis];
          const trackRect = track.getBoundingClientRect();
          const trackSize = trackRect[ESizeAttributes[draggedAxis]];
          const contentSize =
            scrollHostElement[EScrollSizeAttributes[draggedAxis]];
          const hostSize = hostRect?.[ESizeAttributes[draggedAxis]] || 0;

          // Расстояние от начала документа до курсора с учетом прокрутки.
          const eventOffset: number = isAxisY(draggedAxis)
            ? event.clientY
            : event.clientX;

          // Получаем позицию
          const dragPos =
            eventOffset -
            trackRect[EOffsetAttributes[draggedAxis]] -
            dragOffset;

          // Получаем отношение
          const dragPerc = dragPos / (trackSize - thumbSize);

          // Расчет скролла
          const scrollPos = dragPerc * (contentSize - hostSize);

          scrollHostElement[EScrollOffsetAttributes[draggedAxis]] =
            draggedAxis === 'y'
              ? Math.min(scrollPos, scrollHeight - offsetHeight)
              : Math.min(scrollPos, scrollWidth - offsetWidth);
        }
      },
      [isDragging, axes],
    );

    const handleScrollThumbMouseDown = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      axis: TAxis,
    ) => {
      if (!scrollHostReference) {
        return;
      }
      preventEvent(event);
      const currentAxis = axes[axis];
      const eventOffset = isAxisY(axis) ? event.clientY : event.clientX;
      const rect = currentAxis.thumb.getBoundingClientRect();

      // Положение мыши от начала thumb.
      currentAxis.dragOffset = eventOffset - rect[EOffsetAttributes[axis]];
      currentAxis.isDrag = true;

      setDragging(true);
    };

    /** Функция для расчета позиции элементов thumb  */
    const positionThumb = (axis: TAxis) => {
      const rectHost = wrapperReference.current?.getBoundingClientRect();
      const contentWrapper =
        scrollHostReference.current || ({} as HTMLDivElement);
      const { thumb, thumbSize, track } = axes[axis];

      // Высота или ширина скролла враппера контента
      const contentSize = contentWrapper[EScrollSizeAttributes[axis]];
      // Внешняя высота или ширина track элемента
      const trackSize = track[EOffsetSizeAttributes[axis]];
      // Высота или ширина враппера
      const hostSize = rectHost?.[ESizeAttributes[axis]] || 0;
      // ширина/высота невидимой, прокрученной в данный момент, части элемента слева и сверху.
      const scrollOffset = contentWrapper[EScrollOffsetAttributes[axis]];
      // Процент скролла
      const scrollPercent = scrollOffset / (contentSize - hostSize);
      // Расчет перемещения thumb элемента
      const handleOffset = Math.min(
        Math.floor((trackSize - thumbSize) * scrollPercent),
        trackSize - thumbSize,
      );

      thumb.style.transform = isAxisY(axis)
        ? `translate3d(0, ${handleOffset ?? 0}px, 0)`
        : `translate3d(${handleOffset ?? 0}px, 0, 0)`;
    };

    /**
     * Вспомогательная функция для handleScroll,
     * которая изменяет позицию thumb элементов
     */
    const scrollAxis = (axis: TAxis = 'x') => {
      if (axes[axis].isOverflowing) {
        positionThumb(axis);
        showScrollbars(axis);
      }
    };

    const handleScroll = useDebounceRaf(() => {
      if (!scrollHostReference) {
        return;
      }

      scrollAxis('x');
      scrollAxis('y');
    });

    /** Обработчик клика на элементы track */
    const handleClickTrack = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      axis: TAxis = 'y',
    ) => {
      const rectHost = wrapperReference.current?.getBoundingClientRect();
      const { thumb } = axes[axis];
      // положения мыши относительно границ viewport
      const { clientX, clientY } = event;
      const contentWrapperElement =
        scrollHostReference.current || ({} as HTMLDivElement);
      const thumbRect = thumb.getBoundingClientRect();
      // Положение элементов thumb left/top
      const scrollbarOffset = thumbRect[EOffsetAttributes[axis]];
      // Размер враппера height/width
      const hostSize = rectHost?.[ESizeAttributes[axis]] || 0;
      // Положение скролла scrollLeft/scrollTop
      let scrolled = contentWrapperElement[EScrollOffsetAttributes[axis]];
      // Булевое значение разницы полжение мыши и scrollbarOffset относительно 0
      const differenceBool =
        (isAxisY(axis)
          ? clientY - scrollbarOffset
          : clientX - scrollbarOffset) < 0;

      // Величина на которую надо проскроллить
      const scrollSize = differenceBool
        ? scrolled - hostSize
        : scrolled + hostSize;

      const scrollTo = () => {
        if (differenceBool) {
          if (scrolled > scrollSize) {
            scrolled -= 40;
            contentWrapperElement.scrollTo({
              [isAxisY(axis) ? 'top' : 'left']: scrolled,
            });
            requestAnimationFrame(scrollTo);
          }
        } else if (scrolled < scrollSize) {
          scrolled += 40;
          const sc = {
            [isAxisY(axis) ? 'top' : 'left']: scrolled,
          };

          contentWrapperElement.scrollTo(sc);
          requestAnimationFrame(scrollTo);
        }
      };

      scrollTo();
    };

    /** Расчет размеров элементов thumb */
    const getThumbSize = (axis: TAxis = 'y') => {
      const { isOverflowing, track } = axes[axis];

      if (!isOverflowing) {
        return 0;
      }

      const innerContent =
        scrollHostReference.current || ({} as HTMLDivElement);
      // Высота или ширина скролла контента
      const contentSize = innerContent[EScrollSizeAttributes[axis]];
      // Внешняя высота или ширина track элемента
      const trackSize = track[EOffsetSizeAttributes[axis]];
      // Соотношение размеров track элемента к контент элементу
      const scrollbarRatio = trackSize / contentSize;
      // Размер thumb
      const size = Math.floor(scrollbarRatio * trackSize) - 4;

      return Math.max(size, thumbMinSize as number);
    };

    /** Функция для обновления скроллбара */
    const update = useThrottle(() => {
      const contentWrapperElement =
        wrapperReference.current || ({} as HTMLDivElement);
      const scrollHostElement =
        scrollHostReference.current || ({} as HTMLDivElement);
      const { scrollHeight, scrollWidth } = scrollHostElement;

      // Опрделяем переполнены ли блок по осям x/y
      axes.x.isOverflowing = scrollWidth > contentWrapperElement.offsetWidth;
      axes.y.isOverflowing = scrollHeight > contentWrapperElement.offsetHeight;

      const offsetXScrollbar = axes.x.isOverflowing ? scrollWidth : 0;
      const offsetYScrollbar = axes.y.isOverflowing ? scrollWidth : 0;

      // Опрделяем переполнены ли блок по осям x/y с учетом ширины нативного скролла
      axes.x.isOverflowing =
        axes.x.isOverflowing &&
        scrollHostElement.scrollWidth >
          scrollHostElement.offsetWidth - offsetXScrollbar;
      axes.y.isOverflowing =
        axes.y.isOverflowing &&
        scrollHostElement.scrollHeight >
          contentWrapperElement.offsetHeight - offsetYScrollbar;

      axes.x.track.style.display = axes.x.isOverflowing ? 'block' : 'none';
      axes.y.track.style.display = axes.y.isOverflowing ? 'block' : 'none';

      // Определяем размер элементов thumb
      axes.y.thumbSize = getThumbSize('y');
      axes.y.thumb.style.height = `${axes.y.thumbSize - 4}px`;
      axes.x.thumbSize = getThumbSize('x');
      axes.x.thumb.style.width = `${axes.x.thumbSize - 4}px`;

      // Определем позицию элементов thumb
      positionThumb('x');
      positionThumb('y');
    });

    /** Подписка на мутацию враппера */
    useMutation(wrapperReference, update, {
      characterData: true,
      childList: true,
      subtree: true,
    });

    /** Подписка на resize враппера */
    useResizeHook(wrapperReference, () => update());
    /** Подписка на resize контента */
    useResizeHook(scrollHostReference, () => update());

    useEffect(() => {
      timerReference.current && clearTimeout(timerReference.current);
      autoHide && hovering && showScrollbars(hoverAxis);
      autoHide &&
        !hovering &&
        (timerReference.current = setTimeout(hideScrollbar, timeout as number));
    }, [hovering]);

    useEffect(() => {
      if (scrollHostReference.current) {
        const scrollHostElement = scrollHostReference.current;

        scrollHostElement?.addEventListener('scroll', handleScroll, true);

        update();

        return function cleanup() {
          scrollHostElement?.removeEventListener('scroll', handleScroll, true);
          update.cancel();
          timerReference.current && clearTimeout(timerReference.current);
        };
      }
    }, []);

    useEffect(() => {
      if (scrollHostReference) {
        const elementDocument = getWrapperDocument();

        // this is handle the dragging on scroll-thumb
        elementDocument.addEventListener('mousemove', handleDocumentMouseMove);
        elementDocument.addEventListener(
          'mouseup',
          handleDocumentMouseUp,
          true,
        );

        return function cleanup() {
          elementDocument.removeEventListener(
            'mousemove',
            handleDocumentMouseMove,
          );
          elementDocument.removeEventListener(
            'mouseup',
            handleDocumentMouseUp,
            true,
          );
        };
      }
    }, [handleDocumentMouseMove, handleDocumentMouseUp]);

    return (
      <ScrollhostContainer
        ref={forkWrapperReference}
        onMouseLeave={handleWrapperMouseLeave}
        onMouseEnter={handleWrapperMouseEnter}
        className={className}
        contentMaxSize={contentMaxSize}
        {...restProperties}
      >
        <div
          className={classes.scrollhost}
          id='scroll'
          ref={forkContentReference}
          {...restProperties}
        >
          {children}
        </div>

        <div
          className={cn(classes.scrollbarTrack, classes.scrollbarTrackY)}
          ref={(reference) =>
            (axes.y.track = reference || ({} as HTMLDivElement))
          }
          onMouseDown={(event) => handleClickTrack(event, 'y')}
          onMouseEnter={() => handleTrackMouseEnter('y')}
          onMouseLeave={handleTrackMouseLeave}
          role='button'
          tabIndex={-1}
        >
          <div
            className={cn(classes.scrollbarThumb, classes.scrollbarThumbY)}
            ref={(reference) =>
              (axes.y.thumb = reference || ({} as HTMLDivElement))
            }
            onMouseDown={(event) => handleScrollThumbMouseDown(event, 'y')}
            role='button'
            tabIndex={-1}
          />
        </div>

        <div
          className={cn(classes.scrollbarTrack, classes.scrollbarTrackX)}
          ref={(reference) =>
            (axes.x.track = reference || ({} as HTMLDivElement))
          }
          onMouseDown={(event) => handleClickTrack(event, 'x')}
          onMouseEnter={() => handleTrackMouseEnter('x')}
          onMouseLeave={handleTrackMouseLeave}
          role='button'
          tabIndex={-1}
        >
          <div
            className={cn(classes.scrollbarThumb, classes.scrollbarThumbY)}
            ref={(reference) =>
              (axes.x.thumb = reference || ({} as HTMLDivElement))
            }
            onMouseDown={(event) => handleScrollThumbMouseDown(event, 'x')}
            role='button'
            tabIndex={-1}
          />
        </div>
      </ScrollhostContainer>
    );
  },
);

OldScrollbar.displayName = 'OldScrollbar';
