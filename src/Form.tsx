import { useFormContext } from "./FormProvider";
import type { FormDefinition } from "./types";

const TextInput = ({
  value,
  path,
  onChange,
}: {
  value: string | undefined;
  path: string;
  onChange: (path: string, value: string) => void;
}) => {
  return (
    <input
      value={value ?? ""}
      onChange={(evt) => {
        const { value } = evt.target;
        onChange(path, value);
      }}
    />
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
}: {
  value: string | undefined;
  path: string;
  onChange: (path: string, value: string) => void;
}) => {
  return (
    <select
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
  const { formValues, onChange: onChangeHandler } = useFormContext();
  return (
    <div>
      <h1>Form</h1>
      <div>
        {formDefinitions.map((def) => {
          return (
            <div key={def.path}>
              <InputRenderer
                definition={def}
                value={formValues[def.path]}
                onChange={onChangeHandler}
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
  onChange,
}: {
  definition: FormDefinition;
  value: string | undefined;
  onChange: (path: string, value: string) => void;
}) => {
  if (definition.type == "text")
    return (
      <TextInput path={definition.path} value={value} onChange={onChange} />
    );

  return (
    <SelectInput path={definition.path} value={value} onChange={onChange} />
  );
};
