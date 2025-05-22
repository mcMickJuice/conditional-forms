import type { Predicate, RuleDefinition, Subject, Or, And } from "./types";

// this is the "rules engine". It processes a rule for a given subject, sometimes recursively
// if there are nested rules via and/or conditions
export function processRulesForSubject(
  formValues: Record<string, string>,
  rule: Subject,
): boolean {
  return processRule(formValues, rule.predicate);
}
// this is the recursive function that rolls up to a single predicate that is returned from processRulesForSubject
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

// on app load, we need to turn definitions, which are a flat list, into a tree
// each Subject type is its own tree, whose children and grandchildren are rule nodes
// if we store our rules as a nested object, this step is likely not needed, however it is easier to update
// if we have a flat list that has pointers to its parent
export function mapDefinitionToRuntimeRules(
  ruleDefinitions: RuleDefinition[],
): Subject[] {
  const subjectDefinitions = ruleDefinitions.filter(
    (rule) => rule.type === "subject",
  );

  const subjects = subjectDefinitions.map<Subject>((subjectDef) => {
    const childDef = ruleDefinitions.find(
      (def) => def.type !== "subject" && def.parentId === subjectDef.id,
    );
    if (childDef == null)
      throw new Error("no child rule defs found for subject");
    return {
      id: subjectDef.id,
      path: subjectDef.path,
      predicate: resolveDefToRule(childDef, ruleDefinitions),
    };
  });
  return subjects;
}

// recursive function that builds up Predicates, especially for those rules with nested rules
// via And | Or
function resolveDefToRule(
  ruleDefinition: RuleDefinition,
  allDefinitions: RuleDefinition[],
): Predicate {
  if (ruleDefinition.type === "and" || ruleDefinition.type === "or") {
    const parentPredicate: Or | And = {
      ...ruleDefinition,
      predicates: allDefinitions
        .filter(
          (def) => def.type !== "subject" && def.parentId === ruleDefinition.id,
        )
        .map((def) => resolveDefToRule(def, allDefinitions)),
    };
    return parentPredicate;
  }
  if (ruleDefinition.type === "subject")
    throw new Error("subject rule cannot be child node.");
  return ruleDefinition;
}
