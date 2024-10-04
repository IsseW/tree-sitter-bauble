module.exports = grammar({
  name: 'bauble',

  extras: $ => [
    /\s/,
    $.line_comment,
  ],

  externals: $ => [
    $.str,
    $.raw,
    $.literal,
  ],

  rules: {
    source_file: $ => seq(repeat($.use), repeat($.object)),
    use: $ => seq('use', optional('::'), $.inner_use, ';'),
    inner_use: $ => choice(
      $.final_use,
      seq($.identifier, '::', choice(seq('{', sep(',', $.inner_use), '}'), $.inner_use))
    ),
    final_use: $ => $.identifier,

    object: $ => choice(seq($.identifier, optional($.type_decl), '=', $.value), seq('copy', $.identifier, '=', $.value)),
    type_decl: $ => seq(':', $.path),

    value: $ => seq(repeat($.attribute), $.inner_value),

    attribute: $ => seq('#[', sep(',', seq($.identifier, '=', $.value)), ']'),

    inner_value: $ => choice(
      $.unit,
      $.number,
      $.bool,
      $.str,
      $.ref,
      $.map,
      $.tuple,
      $.struct,
      $.array,
      $.path,
      $.raw,
      $.literal,
    ),

    map: $ => seq('{', sep(',', seq($.value, ':', $.value)), '}'),
    struct: $ => seq($.path, '{', sep(',', $.field), '}'),
    field: $ => seq($.identifier, ':', $.value),
    tuple: $ => seq(optional($.path), '(', sep(',', $.value), ')'),
    array: $ => seq('[', sep(',', $.value), ']'),

    unit: $ => '()',
    bool: $ => choice('false', 'true'),

    ref: $ => seq('$', $.path),

    path: $ => seq(optional('::'), $.identifier, repeat(seq('::', $.identifier))),

    identifier: $ => /(r#)?[_\p{XID_Start}][_\p{XID_Continue}]*/,
    number: $ => seq(/\d+/, optional(seq('.', /\d+/))),

    line_comment: $ => token(seq(
      '//', /.*/
    )),
  }
});

function sep1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)), optional(sep))
}

function sep(sep, rule) {
  return optional(sep1(sep, rule))
}
