// *Definitions are db/backend types, stored at rest
// this is the input field that the rule applies to
export type SubjectDefinition = {
  id: string; // ids sole purpose is to link fields together and act as a key in the db. These are UUIDs
  path: string; // key of the subject input field. This is used in the frontend when resolving the rule
};

export type AndDefinition = {
  id: string;
  type: "and";
  parentId: string;
};
export type OrDefinition = {
  id: string;
  type: "or";
  parentId: string;
};
export type EqualsDefinition = {
  id: string;
  type: "equals";
  parentId: string;
  value: string | number;
  path: string; // key of an input field that determines visibility/requirement value of subject
  negation?: true;
};
export type ComparisonDefinition = {
  id: string;
  type: "comparison";
  parentId: string;
  value: number;
  path: string;
  comparisonType: "<" | "<=" | ">" | ">=";
};

export type InDefinition = {
  id: string;
  type: "in";
  parentId: string;
  path: string;
  value: (string | number)[];
  negation: boolean;
};

// these are runtime types, hydrated on the client
export type Subject = {
  id: string;
  path: string;
  predicate: Predicate;
};
type Predicate =
  | And
  | Or
  | EqualsDefinition
  | ComparisonDefinition
  | InDefinition;
type And = AndDefinition & { predicates: Predicate[] };
type Or = OrDefinition & { predicates: Predicate[] };

const subject: Subject = {
  id: "subj",
  path: "first-input",
  predicate: {
    id: "or",
    parentId: "subj",
    type: "or",
    predicates: [
      {
        id: "other-eq",
        type: "comparison",
        path: "number",
        parentId: "or",
        comparisonType: ">",
        value: 10,
      },
      {
        id: "eq",
        type: "equals",
        parentId: "or",
        path: "second-input",
        value: "foo",
      },
    ],
  },
};
type FormValue = { path: string; value: any };
function processRulesForSubject(
  formValues: FormValue[],
  rule: Subject,
): boolean {
  return processRule(formValues, rule.predicate);
}
function processRule(formValues: FormValue[], predicate: Predicate): boolean {
  if (predicate.type === "and") {
    return predicate.predicates.every((pred) => processRule(formValues, pred));
  }
  if (predicate.type === "or") {
    return predicate.predicates.some((pred) => processRule(formValues, pred));
  }

  const formValue = formValues.find((fv) => fv.path === predicate.path);
  if (!formValue) {
    // this should not throw, instead it should set a default value???
    throw new Error("form value not found shoot!");
  }

  if (predicate.type === "equals") {
    if (predicate.negation) return predicate.value !== formValue.value;
    return predicate.value === formValue.value;
  }
  if (predicate.type === "comparison") {
    switch (predicate.comparisonType) {
      case "<":
        return formValue.value < predicate.value;
      case "<=":
        return formValue.value <= predicate.value;
      case ">":
        return formValue.value > predicate.value;
      case ">=":
        return formValue.value >= predicate.value;
      default:
        return false;
    }
  }

  return predicate.value.includes(formValue.value);
}
