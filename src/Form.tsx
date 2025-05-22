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
  // bind onChange with context provider
  // get value from context provider
  // get required from context provider
  const {
    formValues,
    requireState,
    onChange: onChangeHandler,
  } = useFormContext();
  return (
    <div>
      <h1>Form</h1>
      <div>
        {formDefinitions.map((def) => {
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
