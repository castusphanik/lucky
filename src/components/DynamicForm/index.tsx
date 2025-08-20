import React, { forwardRef, useImperativeHandle } from 'react';
import { Autocomplete, DateSelect, RadioGroup, Select, TextInput } from '../Inputs';
import { useFormValidator, type TValidations } from '@/hooks/useFromValidator';

type omitProps = 'name' | 'value' | 'label' | 'options' | 'isRequired';

type inputProps<T extends React.ElementType> = {
  props?: Omit<React.ComponentProps<T>, omitProps>;
};

type TOptions = { label: string; value: string }[];

type TTextInput = { type: 'textInput' } & inputProps<typeof TextInput>;
type TDateSelect = { type: 'dateSelect' } & inputProps<typeof DateSelect>;
type TSelect = { type: 'select'; options: TOptions } & inputProps<typeof Select>;
type TRadioGroup = { type: 'radioGroup'; options: TOptions } & inputProps<typeof RadioGroup>;
type TAutocomplete = { type: 'autocomplete'; options: TOptions } & inputProps<typeof Autocomplete>;

type inputType = TTextInput | TSelect | TDateSelect | TRadioGroup | TAutocomplete;
type commonProps = { label: string; name: string; validations?: TValidations };

export type TFormData = (commonProps & inputType)[];

type TObj = Record<string, string>;

type TProps = {
  formData: TFormData;
  className?: string;
  onSubmit?: (values: TObj) => void;
};

export type DynamicFormRef = {
  submitForm: () => void;
};

const DynamicForm = forwardRef<DynamicFormRef, TProps>((props, ref) => {
  const { formData, className, onSubmit } = props;

  const validations = formData.map(item => {
    return {
      name: item.name,
      validations: item?.validations || {},
    };
  });

  const { values, errors, handleChange, handleSubmit } = useFormValidator(validations);

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit(data => onSubmit && onSubmit(data)),
  }));

  return (
    <div className={className}>
      {formData.map((item, i) => (
        <RenderInput key={i} data={item} value={values} error={errors} onChange={handleChange} />
      ))}
    </div>
  );
});

export default DynamicForm;

type TRenderInputProps = {
  data: commonProps & inputType;
  value: { [key: string]: string };
  error?: { [key: string]: string };
  onChange: (name: string, value: string) => void;
};

function RenderInput({ data, value, error, onChange }: TRenderInputProps) {
  const baseProps = {
    isRequired: data?.validations?.isRequired,
    label: data.label,
    name: data.name,
    value,
    error,
    onChange,
  };

  switch (data.type) {
    case 'dateSelect':
      return <DateSelect {...data.props} {...baseProps} />;
    case 'select':
      return <Select {...data.props} {...baseProps} options={data.options} />;
    case 'radioGroup':
      return <RadioGroup {...data.props} {...baseProps} options={data.options} />;
    case 'autocomplete':
      return <Autocomplete {...data.props} {...baseProps} options={data.options} />;
    default:
      return <TextInput {...data.props} {...baseProps} />;
  }
}
