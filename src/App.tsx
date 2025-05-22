import "./App.css";
import { Form } from "./Form";
import { FormContextProvider } from "./FormProvider";
import type { FormDefinition } from "./types";
const definitions: FormDefinition[] = [
  { type: "text", path: "first-input" },
  { type: "text", path: "second-input" },
  { type: "select", path: "first-select" },
];
function App() {
  return (
    <>
      <div>
        <FormContextProvider>
          <Form definitions={definitions} />
        </FormContextProvider>
      </div>
    </>
  );
}

export default App;
