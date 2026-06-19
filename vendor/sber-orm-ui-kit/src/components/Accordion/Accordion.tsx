import {
  Accordion as VAccordion,
  AccordionItem as VAccordionItem,
  AccordionItemProps as VAccordionItemProps,
  AccordionProps as VAccordionProps,
} from '@v-uik/accordion';
import cn from 'classnames';
import { useCallback, useMemo, useState } from 'react';

import { EIconName, iconMap } from '../../icons';
import styles from './styles.module.scss';

const NextIcon = iconMap[EIconName.next];

const Icon = () => <NextIcon className={styles.headerIcon} />;

export interface IAccordionProps extends VAccordionProps {
  fullWidth?: boolean;
  variant?: 'view' | 'edit';
}

export interface IAccordionItemProps
  extends Omit<VAccordionItemProps, 'onChange'> {
  onChange?: (expanded: boolean) => void;
}

export const Accordion = (props: IAccordionProps) => {
  const { fullWidth, variant = 'view', className, ...rest } = props;

  return (
    <VAccordion
      {...rest}
      className={cn(
        styles.accordion,
        { [styles.editable]: variant === 'edit' },
        { [styles.accordionFullWidth]: fullWidth },
        className,
      )}
    />
  );
};

export const AccordionItem = (props: IAccordionItemProps) => {
  const { expanded: expandedProperty = false, onChange, ...rest } = props;
  const [expanded, setExpanded] = useState(expandedProperty);

  const handleChange = useCallback(() => {
    setExpanded(!expanded);
    onChange?.(!expanded);
  }, [expanded, onChange, setExpanded]);

  const classes = useMemo(
    () => ({
      root: styles.accordionItem,
      header: styles.accordionHeader,
      headerText: styles.accordionHeaderText,
      expanded: styles.accordionExpanded,
      content: styles.accordionContent,
    }),
    [],
  );

  return (
    <VAccordionItem
      classes={classes}
      expanded={expanded}
      onClick={handleChange}
      components={{ Icon }}
      {...rest}
    />
  );
};
