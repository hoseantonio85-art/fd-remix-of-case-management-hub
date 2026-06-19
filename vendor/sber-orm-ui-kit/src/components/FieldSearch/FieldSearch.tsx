import { EIconName } from '../../icons';
import { FieldSelect, IFieldSelectProperties } from '../FieldSelect';
import { Input } from '../Input';
import { TSelectProperties } from '../Select';

export interface IFieldSearchProperties
  extends Omit<IFieldSelectProperties, 'icon' | 'scopeProps'> {
  scopeProps?: TSelectProperties;
}

export const FieldSearch = (props: IFieldSearchProperties) => {
  const {
    label,
    search,
    handleChange,
    value,
    scopeProps,
    grayIcon,
    ...inputProps
  } = props;
  const scopeValue = search?.scope ?? scopeProps?.options?.[0] ?? null;

  if (!props.scopeProps) {
    return (
      <Input
        {...inputProps}
        value={value ?? search?.value ?? ''}
        onChange={(value: string) => handleChange?.(value, scopeValue)}
        label={label ?? 'Search'}
        grayPrefix={!!grayIcon}
        icon='search'
      />
    );
  }

  return (
    <FieldSelect
      {...(props as IFieldSelectProperties)}
      icon={'search' as EIconName}
    />
  );
};
