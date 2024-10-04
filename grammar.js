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
      $.final_path_part,
      seq($.path_part, '::', choice(seq('{', $.use_list, '}'), $.inner_use))
    ),
    use_list: $ => sep1(',', $.inner_use),
    path_part: $ => $.identifier,
    final_path_part: $ => $.identifier,

    object: $ => choice(seq($.identifier, optional($.type_decl), $.assignment), seq('copy', $.identifier, $.assignment)),
    type_decl: $ => seq(':', $.path),

    value: $ => seq(repeat($.attribute), $.inner_value),

    attribute: $ => seq('#[', $.attribute_inner, ']'),
    attribute_inner: $ => sep1(',', seq($.identifier, $.assignment)),

    assignment: $ => seq('=', $.value),

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

    map: $ => seq('{', optional($.map_inner), '}'),
    map_inner: $ => sep1(',', seq($.value, ':', $.value)),

    struct: $ => seq($.path, '{', optional($.struct_inner), '}'),
    struct_inner: $ => sep1(',', $.field),
    field: $ => seq($.identifier, ':', $.value),

    tuple: $ => seq(optional($.path), '(', optional($.seq_inner), ')'),
    array: $ => seq('[', optional($.seq_inner), ']'),

    seq_inner: $ => sep1(',', $.value),

    unit: $ => '()',
    bool: $ => choice('false', 'true'),

    ref: $ => seq('$', $.path),

    path: $ => seq(optional('::'), repeat(seq($.path_part, '::')), $.final_path_part),

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
