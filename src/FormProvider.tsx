import { createContext, useContext, useMemo, useState } from "react";
import type { FormDefinition, RuleDefinition } from "./types";
import { mapDefinitionToRuntimeRules, processRulesForSubject } from "./rules";

type FormContextValue = {
  formValues: Record<string, string>;
  requireState: Record<string, boolean>;
  onChange: (path: string, value: string) => void;
};
const FormContext = createContext<FormContextValue | undefined>(undefined);

export const FormContextProvider = ({
  children,
  formDefinitions,
  rules,
}: {
  children: React.ReactNode;
  formDefinitions: FormDefinition[];
  rules: RuleDefinition[];
}) => {
  const [formState, setFormState] = useState<{
    formValues: Record<string, string>;
    requireState: Record<string, boolean>;
  }>({ formValues: {}, requireState: {} });
  const subjectRules = useMemo(() => {
    return mapDefinitionToRuntimeRules(rules);
  }, [rules]);
  console.log(subjectRules);

  const onChangeHandler = useMemo(() => {
    return (path: string, value: string) => {
      setFormState((state) => {
        const newFormValues = { ...state.formValues };
        newFormValues[path] = value;
        // calculate require state looking at all definitions bumped against form state
        const newRequireState: Record<string, boolean> = {};
        formDefinitions.forEach((def) => {
          const subjectRule = subjectRules.find(
            (rule) => rule.path === def.path,
          );
          if (subjectRule) {
            const result = processRulesForSubject(newFormValues, subjectRule);
            newRequireState[def.path] = result;
          }
        });
        return { formValues: newFormValues, requireState: newRequireState };
      });
    };
  }, [setFormState, subjectRules, formDefinitions]);
  console.log(formState);
  return (
    <FormContext.Provider
      value={{
        formValues: formState.formValues,
        requireState: formState.requireState,
        onChange: onChangeHandler,
      }}
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
