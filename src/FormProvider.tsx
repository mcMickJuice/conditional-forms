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

  const onChangeHandler = useMemo(() => {
    return (path: string, value: string) => {
      setFormState((state) => {
        const newFormValues = { ...state.formValues };
        // on change, update form value at updated path
        newFormValues[path] = value;

        // we'll need to recalculate the required state for the entire form. We'll do this by iterating
        // through formDefinitions, finding subjectRules if they exist, and pass rules into rules engine
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
        // both the formValues and requireState are held in client state, and are accessed in the Form component
        return { formValues: newFormValues, requireState: newRequireState };
      });
    };
  }, [setFormState, subjectRules, formDefinitions]);
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
