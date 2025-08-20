import { useState } from "react";

const numberRegex = /^[0-9]{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/;

export type TValidations = {
  isRequired?: boolean;
  isEmail?: boolean;
  isMobileNumber?: boolean;
  isWebsite?: boolean;
  minLength?: number;
  customValidation?: (value: string) => string | undefined;
};

export type TFormValidations = { name: string; validations: TValidations }[];

function validate(value: any, validations: TValidations): string | undefined {
  if (validations?.isRequired && (!value || value.toString().trim().length === 0)) {
    return "required";
  }

  if (value && typeof value === "string") {
    if (validations?.isEmail && !emailRegex.test(value)) {
      return "Invalid email address.";
    }

    if (validations?.isMobileNumber && !numberRegex.test(value)) {
      return "Invalid mobile number.";
    }

    if (validations?.isWebsite && !urlRegex.test(value)) {
      return "Invalid website URL.";
    }

    if (validations?.minLength && value.length < validations.minLength) {
      return `Minimum ${validations.minLength} characters required.`;
    }

    if (validations?.customValidation) {
      return validations.customValidation(value);
    }
  }

  return undefined;
}

type TFormState = Record<string, any>;
type TErrorState = Record<string, string>;

export function useFormValidator(formValidations: TFormValidations) {
  const [values, setValues] = useState<TFormState>({});
  const [errors, setErrors] = useState<TErrorState>({});

  function handleChange(name: string, value: any) {
    setValues((prev) => ({ ...prev, [name]: value }));

    const fieldValidation = formValidations.find((item) => item.name === name)?.validations || {};
    const error = validate(value, fieldValidation);

    setErrors((prev) => {
      const { [name]: _, ...rest } = prev;
      return error ? { ...rest, [name]: error } : rest;
    });
  }

  function validateAll() {
    const newErrors: TErrorState = {};

    formValidations.forEach(({ name, validations }) => {
      const error = validate(values[name], validations);
      if (error) newErrors[name] = error;
    });

    setErrors(newErrors);
    return newErrors;
  }

  function handleSubmit(onValid: (data: TFormState) => void) {
    return function (e?: React.FormEvent) {
      e?.preventDefault();
      const errors = validateAll();

      if (Object.keys(errors).length === 0) {
        onValid(values);
      }
    };
  }

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
}
