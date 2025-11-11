; highlights.scm

"return" @keyword
"<-" @keyword
"if" @keyword
"then" @keyword
"else" @keyword
"match" @keyword

"car" @operator
"cdr" @operator
"frst" @operator
"scnd" @operator
"cons" @operator

"^" @operator
"*" @operator
"/" @operator
"%" @operator
"+" @operator
"-" @operator

"==" @operator
"!=" @operator
"<=" @operator
">=" @operator
"<" @operator
">" @operator
"!" @operator
"?" @operator
"in" @operator

"." @operator
".." @operator

"," @punctuation
";" @punctuation
"|" @punctuation
"(" @punctuation
")" @punctuation
"[" @punctuation
"]" @punctuation
"{" @punctuation
"}" @punctuation

"=" @punctuation
":" @punctuation
"`" @punctuation

(string) @string
(fstring) @string

(boolean) @boolean

(wildcard) @constant
(unit) @constant

(number) @number

(glyph) @function
(function name: (identifier) @function)
(function parameters: (parameter_list (identifier)) @emphasis)
(lambda parameters: (parameter_list (identifier)) @emphasis)
(application callable: (literal (identifier)) @function)
(arguments (pivot) @operator)
(name_definition ("=") @operator)
