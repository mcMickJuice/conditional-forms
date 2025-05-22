import "./App.css";
import { Form } from "./Form";
import { FormContextProvider } from "./FormProvider";
import type { RuleDefinition } from "./rules-engine";
import type { FormDefinition } from "./types";
const definitions: FormDefinition[] = [
  { type: "text", path: "first-input" },
  { type: "text", path: "second-input" },
  { type: "select", path: "first-select" },
];
const rules: RuleDefinition[] = [
  { type: "subject", id: "1", path: "first-input" },
  {
    type: "equals",
    id: "2",
    parentId: "1",
    path: "second-input",
    value: "foo",
  },
];
function App() {
  return (
    <>
      <div>
        <FormContextProvider rules={rules} formDefinitions={definitions}>
          <Form formDefinitions={definitions} />
        </FormContextProvider>
      </div>
    </>
  );
}

export default App;
