import { useFormContext } from "./FormProvider";
import type { FormDefinition } from "./types";

const TextInput = ({
  value,
  path,
  onChange,
  required,
}: {
  value: string | undefined;
  path: string;
  required: boolean;
  onChange: (path: string, value: string) => void;
}) => {
  const requiredClass = required && !value ? "required" : "";
  return (
    <>
      <label>{path}</label>
      <input
        value={value ?? ""}
        className={requiredClass}
        onChange={(evt) => {
          const { value } = evt.target;
          onChange(path, value);
        }}
      />
      {required && <span>REQUIRED</span>}
    </>
  );
};

const options = [
  {
    display: "First",
    value: "first",
  },
  {
    display: "Second",
    value: "second",
  },
  {
    display: "Third",
    value: "third",
  },
];
const SelectInput = ({
  value,
  path,
  onChange,
  required,
}: {
  value: string | undefined;
  path: string;
  onChange: (path: string, value: string) => void;
  required: boolean;
}) => {
  const requiredClass = required && !value ? "required" : "";
  return (
    <>
      <label>{path}</label>
      <select
        className={requiredClass}
        onChange={(evt) => {
          const { value } = evt.target;
          onChange(path, value);
        }}
        value={value ?? options[0].value}
      >
        {options.map((option) => (
          <option key={option.value}>{option.display}</option>
        ))}
      </select>
      {required && <span>REQUIRED</span>}
    </>
  );
};

export const Form = ({
  formDefinitions,
}: {
  formDefinitions: FormDefinition[];
}) => {
  const {
    formValues,
    requireState,
    onChange: onChangeHandler,
  } = useFormContext();
  return (
    <div>
      {formDefinitions.map((def) => {
        // when rendering each input from form definitions, lookup the requiredState by path
        // this state is set in the onChange handler in FormContextProvider
        const isRequired = requireState[def.path];
        return (
          <div key={def.path}>
            <InputRenderer
              definition={def}
              value={formValues[def.path]}
              onChange={onChangeHandler}
              isRequired={isRequired}
            />
          </div>
        );
      })}
    </div>
  );
};

const InputRenderer = ({
  definition,
  value,
  isRequired = false,
  onChange,
}: {
  definition: FormDefinition;
  value: string | undefined;
  isRequired: boolean;
  onChange: (path: string, value: string) => void;
}) => {
  // inputs don't know nor do they care where required comes from, as it's just passed as a prop
  if (definition.type == "text")
    return (
      <TextInput
        path={definition.path}
        value={value}
        onChange={onChange}
        required={isRequired}
      />
    );

  return (
    <SelectInput
      path={definition.path}
      value={value}
      onChange={onChange}
      required={isRequired}
    />
  );
};
