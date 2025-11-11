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

(string) @string
(fstring) @string

(unit) @boolean
(boolean) @boolean

(number) @number
(function name: (identifier) @function)
(function parameters: (parameter_list (identifier)) @emphasis)
(application callable: (literal (identifier)) @function)
(arguments (pivot) @operator)
(name_definition ("=") @operator)

(wildcard) @constant
