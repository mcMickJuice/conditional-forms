// *Definitions are db/backend types, stored at rest
// this is the input field that the rule applies to
export type SubjectDefinition = {
  type: "subject";
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

export type RuleDefinition =
  | SubjectDefinition
  | AndDefinition
  | OrDefinition
  | EqualsDefinition
  | ComparisonDefinition
  | InDefinition;

// these are runtime types, hydrated on the client
export type Subject = {
  id: string;
  path: string;
  predicate: Predicate;
};
export type Predicate =
  | And
  | Or
  | EqualsDefinition
  | ComparisonDefinition
  | InDefinition;
export type And = AndDefinition & { predicates: Predicate[] };
export type Or = OrDefinition & { predicates: Predicate[] };

export function processRulesForSubject(
  formValues: Record<string, string>,
  rule: Subject,
): boolean {
  return processRule(formValues, rule.predicate);
}
function processRule(
  formValues: Record<string, any>,
  predicate: Predicate,
): boolean {
  if (predicate.type === "and") {
    return predicate.predicates.every((pred) => processRule(formValues, pred));
  }
  if (predicate.type === "or") {
    return predicate.predicates.some((pred) => processRule(formValues, pred));
  }

  const formValue = formValues[predicate.path];
  if (!formValue) {
    // this should not throw, instead it should set a default value???
    return false;
  }

  if (predicate.type === "equals") {
    if (predicate.negation) return predicate.value !== formValue;
    return predicate.value === formValue;
  }
  if (predicate.type === "comparison") {
    switch (predicate.comparisonType) {
      case "<":
        return formValue < predicate.value;
      case "<=":
        return formValue <= predicate.value;
      case ">":
        return formValue > predicate.value;
      case ">=":
        return formValue >= predicate.value;
      default:
        return false;
    }
  }

  return predicate.value.includes(formValue.value);
}
