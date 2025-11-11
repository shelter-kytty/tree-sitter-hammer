; locals.scm

(block) @local.scope
(function body: (expression) @local.scope)
(lambda body: (expression) @local.scope)

(function parameters: (parameter_list (identifier)) @local.definition)
(lambda parameters: (parameter_list (identifier)) @local.definition)

(function name: (identifier) @local.definition)
(name_definition name: (identifier) @local.definition)
