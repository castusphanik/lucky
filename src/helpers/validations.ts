const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._]+\.[a-zA-Z]{2,4}$/;
const numberRegex = /^\d*$/;
const urlRegex =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?\w+=\w+(&\w+=\w+)*)?\/?$/;

type TValidations = {
  isRequired?: boolean;
  isEmail?: boolean;
  isMobileNumber?: boolean;
  isWebsite?: boolean;
  minLength?: number;
  customValidation?: (value: string) => string;
};
export type TFormValidations = { name: string; validations: TValidations }[];

type TObject = { [key: string]: any };

function validate(value: any, validations: TValidations) {
  let error;

  if (
    validations?.isRequired &&
    (!value || (typeof value === 'string' ? value.trim()?.length === 0 : value?.length === 0))
  ) {
    error = 'required';
  } else if (value && typeof value === 'string' && value.length !== 0) {
    if (validations?.isEmail && !emailRegex.test(value)) {
      error = 'Invalid email address';
    } else if (
      validations?.isMobileNumber &&
      (!numberRegex.test(value) || value?.length > 10 || value?.length < 10)
    ) {
      error = 'Invalid Mobile number';
    } else if (validations?.isWebsite && !urlRegex.test(value)) {
      error = 'Invalid Website Url';
    } else if (validations?.minLength && value?.length < validations?.minLength) {
      error = `Minimum ${validations?.minLength} characters are required`;
    } else if (validations?.customValidation) {
      error = validations?.customValidation(value);
    }
  }

  return error;
}

export function validateFormDataOnSubmit(
  inputs: TObject,
  formValidations: TFormValidations
): { isError: boolean; formErrors: { [key: string]: string } } {
  const errors = formValidations?.map(item => {
    const error = validate(inputs[item.name], item.validations);
    return {
      [item.name]: error,
    };
  });

  let formErrors = Object.assign({}, ...errors);
  formErrors = JSON.stringify(formErrors);
  formErrors = JSON.parse(formErrors);

  const isError = Object.keys(formErrors).length !== 0;

  return { isError, formErrors };
}

type TSetState = React.Dispatch<
  React.SetStateAction<{
    [key: string]: string;
  }>
>;

export function validateFormDataOnChange(
  name: string,
  value: any,
  formValidations: TFormValidations,
  errors: { [key: string]: string },
  setErrors: TSetState
) {
  const validations =
    formValidations.find(item => item.name === name)?.validations || ({} as TValidations);
  const error = validate(value, validations);

  if (error) {
    setErrors(data => {
      return {
        ...data,
        [name]: error,
      };
    });
  } else {
    delete errors[name];
  }
}
