import { useMemo } from 'react';

import {
  Modal as VModal,
  ModalBody as VModalBody,
  ModalBodyProps as VModalBodyProperties,
  ModalFooter as VModalFooter,
  ModalFooterProps as VModalFooterProperties,
  ModalHeader as VModalHeader,
  ModalHeaderProps as VModalHeaderProperties,
  ModalProps as VModalProperties,
} from '@v-uik/modal';

import styles from './styles.module.scss';

const modalClasses = {
  modalContainer: styles.modalContainer,
  modalContent: styles.modalContent,
};
const modalHeaderClasses = {
  closeButton: styles.closeButton,
  root: styles.headerRoot,
};
const modalBodyClasses = {
  body: styles.body,
};

export const Modal = (properties: VModalProperties) => (
  <VModal classes={modalClasses} {...properties} />
);

export const ModalHeader = (properties: VModalHeaderProperties) => {
  const closeButtonProps = useMemo(
    () => ({
      className: styles.closeButton,
      ...(properties.closeButtonProps || {}),
    }),
    [properties.closeButtonProps],
  );
  const titleProps = useMemo(
    () => ({
      className: styles.headerTitle,
      ...(properties.titleProps || {}),
    }),
    [properties.titleProps],
  );

  return (
    <VModalHeader
      classes={modalHeaderClasses}
      titleProps={titleProps}
      closeButtonProps={closeButtonProps}
      {...properties}
    />
  );
};

export const ModalBody = (properties: VModalBodyProperties) => (
  <VModalBody classes={modalBodyClasses} {...properties} />
);

export interface IModalFooterProperties extends VModalFooterProperties {
  // Выключает бордер сверху футера модалки
  noBorder?: boolean;
}

export const ModalFooter = ({
  noBorder = true,
  ...properties
}: IModalFooterProperties) => {
  const className = useMemo(() => {
    if (noBorder) {
      return `${styles.footer} ${styles.noBorder}`;
    }

    return styles.footer;
  }, [properties]);

  return <VModalFooter className={className} {...properties} />;
};
