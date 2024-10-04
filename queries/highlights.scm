"use" @keyword
"copy" @keyword
(path) @type
(str) @string

(bool) @constant.boolean
(number) @constant.numeric

(raw) @string
(literal) @string

(object (identifier) @variable)

(field (identifier) @variable.field)

"," @punctuation.delimiter
":" @punctuation.delimiter

"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket

(line_comment) @comment.line
(ERROR) @error
