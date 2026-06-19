import { FactoryOpts, InputMask as InputMaskProps } from 'imask';
import React, { useEffect, useRef, useState } from 'react';
import { useIMask } from 'react-imask';

import { Input as InputComponent } from '../Input';

interface IInputProps
  extends Omit<React.ComponentProps<typeof InputComponent>, 'onChange'> {
  onChange?: (
    value: InputMaskProps<FactoryOpts>['value'],
    unmaskedValue?: InputMaskProps<FactoryOpts>['unmaskedValue'],
  ) => void;
}
export interface IMaskedInputProps extends IInputProps {
  maskOptions: FactoryOpts;
  clearIncomplete?: boolean;
}

/**
 * Masked Input Component
 * @see {@link https://github.com/uNmAnNeR/imaskjs/tree/master/packages/react-imask}
 */
export const InputMask = React.forwardRef<HTMLInputElement, IMaskedInputProps>(
  (props, ref) => {
    const {
      maskOptions,
      value: defaultValue = '',
      onChange,
      clearIncomplete = false,
      ...rest
    } = props;

    const [opts, setOpts] = useState<FactoryOpts>(maskOptions);

    /**
     * Добавил флаг для исправления ошибки при измении значения вне библиотеки,
     * для синхронизации значений во время очистки поля
     * Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.
     */
    const eventOnClearRef = useRef(false);

    const focusedRef = useRef(false);

    const {
      ref: IMaskInput,
      maskRef,
      value,
      setValue,
    } = useIMask(opts, {
      defaultValue: defaultValue as string,
      onAccept: (value, mask) => {
        onChange?.(value, mask.unmaskedValue);
      },
    });

    const inputMaskRef = IMaskInput as React.MutableRefObject<HTMLInputElement>;

    function handleRefs(instance: HTMLInputElement | null) {
      if (ref) {
        if (typeof ref === 'function') {
          ref(instance);
        } else {
          ref.current = instance;
        }
      }

      if (instance) {
        inputMaskRef.current = instance;
      }
    }

    const handleUpdateValue = () => {
      if (maskRef.current) {
        maskRef.current.updateValue();
      }
    };

    const handleClear = () => {
      eventOnClearRef.current = true;
      setValue('');
      onChange?.('', '');
      handleUpdateValue();
    };

    useEffect(() => {
      setOpts(maskOptions);
    }, [maskOptions]);

    useEffect(() => {
      const maskInstance = maskRef.current;
      if (!maskInstance || !inputMaskRef.current || defaultValue === value) {
        return;
      }

      eventOnClearRef.current = true;
      setValue((defaultValue ?? '') as string);
      inputMaskRef.current.value = (defaultValue ?? '') as string;
      maskInstance.updateValue();
    }, [defaultValue]);

    return (
      <InputComponent
        {...rest}
        ref={handleRefs}
        value={value}
        onChange={() => {
          if (eventOnClearRef.current) {
            eventOnClearRef.current = false;
            handleUpdateValue();
          }
        }}
        onFocus={() => {
          focusedRef.current = true;
        }}
        onBlur={() => {
          if (
            focusedRef.current &&
            clearIncomplete &&
            !maskRef?.current?.masked?.isComplete
          ) {
            focusedRef.current = false;
            setValue('');
          }
        }}
        onClear={handleClear}
      />
    );
  },
);
