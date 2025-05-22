import { createContext, useContext, useMemo, useState } from "react";

type FormContextValue = {
  formValues: Record<string, string>;
  onChange: (path: string, value: string) => void;
};
const FormContext = createContext<FormContextValue | undefined>(undefined);

export const FormContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formState, setFormState] = useState<Record<string, string>>({});

  const onChangeHandler = useMemo(() => {
    return (path: string, value: string) => {
      setFormState((state) => {
        const newState = { ...state };
        newState[path] = value;
        return newState;
      });
    };
  }, [setFormState]);
  return (
    <FormContext.Provider
      value={{ formValues: formState, onChange: onChangeHandler }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = (): FormContextValue => {
  const value = useContext(FormContext);

  if (value == null)
    throw new Error(
      "cannot call useFormContext outside of FormContextProvider",
    );

  return value;
};
