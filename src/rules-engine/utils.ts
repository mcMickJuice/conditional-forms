import type { And, Or, Predicate, RuleDefinition, Subject } from ".";

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
