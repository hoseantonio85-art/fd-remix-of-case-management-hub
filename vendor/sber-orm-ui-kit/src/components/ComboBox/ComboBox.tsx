import { Select, TSelectProperties } from '../Select';

export const ComboBox = (properties: TSelectProperties) => {
  return <Select isSearchable clearInputOnBlur {...properties} />;
};
