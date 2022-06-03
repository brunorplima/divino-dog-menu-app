import { FieldProps } from "formik";
import React from "react";
import Select from "react-select";

export interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps extends FieldProps {
  options: Option[];
  isMulti?: boolean;
  className?: string;
  placeholder?: string;
}

export const CustomSelect = ({
  className,
  field,
  form,
  options,
  placeholder = '',
  isMulti = false
}: CustomSelectProps) => {
  const onChange = (option: Option | Option[]) => {
    form.setFieldValue(
      field.name,
      isMulti
        ? (option as Option[]).map(item => item.value)
        : (option as Option).value
    );
  };

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter((option: Option) => field?.value?.indexOf(option.value) >= 0)
        : options.find((option: Option) => option?.value === field?.value);
    } else {
      return isMulti ? [] : ("" as any);
    }
  };

  return (
    <Select
      className={className}
      name={field.name}
      value={getValue()}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
    />
  );
};

export default CustomSelect;
