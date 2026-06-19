import cn from 'classnames';
import { useEffect, useMemo, useState } from 'react';

import classes from './styles.module.scss';

interface IBarChartProperties {
  percents: number;
  withoutLimit?: boolean;
  size?: number;
  withoutAnimation?: boolean;
}

const loadingDuration = 1000;

export const BarChart = (properties: IBarChartProperties) => {
  const {
    percents,
    size = 92,
    withoutAnimation = false,
    withoutLimit = false,
  } = properties;

  const strokeDasharray = `calc(2 * 3.14  * calc(${size / 2} - 5))`;

  const [trackProgress, setTrackProgress] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const progressForStrokeDashoffset = useMemo(
    () =>
      progress < 95 || (percents > 99 && percents < 195) || percents > 199
        ? progress
        : 95,
    [progress, percents],
  );
  const strokeDashoffset = useMemo(
    () =>
      `calc(${strokeDasharray} * ((100 - ${progressForStrokeDashoffset}) / 100))`,
    [progressForStrokeDashoffset],
  );
  const value = useMemo(
    () =>
      withoutLimit ? '--' : `${trackProgress > 999 ? '>999' : trackProgress}%`,
    [trackProgress, withoutLimit],
  );

  useEffect(() => {
    if (withoutAnimation) {
      setTrackProgress(percents);
      setProgress(percents < 200 && percents !== 100 ? percents % 100 : 100);

      return;
    }
    const loadingTimeout = setTimeout(() => {
      if (trackProgress >= percents) {
        return;
      }

      if (trackProgress < 200) {
        setProgress(progress > 99 ? 1 : progress + 1);
      }

      setTrackProgress(trackProgress + 1);
    }, loadingDuration / 100);

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [trackProgress, percents, withoutAnimation]);

  return (
    <div
      style={{ height: `${size}px`, width: `${size}px` }}
      className={classes.wrapper}
    >
      <svg>
        <circle
          className={cn(classes.track, {
            [classes.trackBurgundy]: trackProgress > 100,
            [classes.trackGray]: withoutLimit,
            [classes.trackGreen]: true,
            [classes.trackOrange]: trackProgress > 49,
            [classes.trackRed]: trackProgress > 84,
          })}
        />
        {!withoutLimit && (
          <circle
            className={cn(classes.progress, {
              [classes.progressBurgundy]: trackProgress > 100,
              [classes.progressGreen]: trackProgress > 0,
              [classes.progressOrange]: trackProgress > 49,
              [classes.progressRed]: trackProgress > 84,
            })}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        )}
      </svg>
      <div
        title={percents > 999 ? String(percents) : undefined}
        className={classes.text}
      >
        {value}
      </div>
    </div>
  );
};
