"use" @keyword
"copy" @keyword
(str) @string

(bool) @constant.boolean
(number) @constant.numeric

(raw) @string
(literal) @string

(object (identifier) @variable)

(field (identifier) @variable.field)

(attribute_inner (identifier) @variable.field)

(ref) @function.macro

(path_part) @namespace
(final_path_part) @type

"," @punctuation.delimiter
":" @punctuation.delimiter
";" @punctuation.delimiter

"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket

"=" @operator

(line_comment) @comment.line
(ERROR) @error
