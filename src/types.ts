export type TextInputDefinition = {
  type: "text";
  path: string;
};
export type SelectInputDefinition = {
  type: "select";
  path: string;
};
export type FormDefinition = TextInputDefinition | SelectInputDefinition;
