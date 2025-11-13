/**
 * @file A tree-sitter parser for hammer
 * @author shelter-kytty <152751739+shelter-kytty@users.noreply.github.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hammer",

  conflicts: ($) => [[$.subscript_args, $.list]],

  word: ($) => $.identifier,

  extras: ($) => [
    /\s/, //whitespace
    $.comment,
  ],

  supertypes: ($) => [$.expression],

  rules: {
    source_file: ($) => repeat($._statememt),

    _statememt: ($) =>
      choice($.function, $.name_definition, $.expression, $.receives, $.return),

    function: ($) =>
      seq(
        field("name", choice($.identifier, $.glyph)),
        ":",
        field("parameters", optional($.parameter_list)),
        "=",
        field("body", $.expression),
      ),

    parameter_list: ($) => repeat1($.identifier),

    name_definition: ($) =>
      prec.right(
        1,
        seq(
          field("name", seq($.identifier, repeat(seq(",", $.identifier)))),
          "=",
          field("value", $.expression),
        ),
      ),

    receives: ($) => prec.right(1, seq($.expression, "<<", $.expression)),

    return: ($) => seq(choice("return", "<-"), $.expression),

    expression: ($) =>
      choice(
        $.block,
        $.application,
        alias($.dollar_apply, $.application),
        $.if_statement,
        $.match,
        $.lambda,
        $.subscript,
        $.unary_expression,
        $.binary_expression,
        $.literal,
      ),

    block: ($) => seq("{", repeat($._statememt), "}"),

    lambda: ($) =>
      seq(
        field("name", alias("_", $.wildcard)),
        ":",
        field("parameters", optional($.parameter_list)),
        "=",
        field("body", $.expression),
      ), //lambda

    application: ($) =>
      prec(
        14,
        seq(field("callable", $.expression), field("args", $.arguments)),
      ),

    arguments: ($) =>
      seq("(", optional(choice(";", separated_with($._arg_exprs, ";"))), ")"),

    _arg_exprs: ($) => choice(alias("_", $.wildcard), $.expression),

    dollar_apply: ($) =>
      prec.right(
        14,
        seq(
          field("callable", $.expression),
          "$",
          alias(repeat($.expression), $.arguments),
          choice(/\r?\n/, ";"),
        ),
      ),

    subscript: ($) =>
      prec.left(
        14,
        seq($.expression, "[", alias($.subscript_args, $.arguments), "]"),
      ),

    subscript_args: ($) =>
      choice(
        $.expression,
        seq(
          optional($.expression),
          alias(":", $.pivot),
          optional($.expression),
        ),
      ),

    unary_expression: ($) =>
      choice(
        prec.left(12, seq("-", $.expression)),
        prec.left(12, seq("!", $.expression)),
        prec.left(12, seq($.expression, "?")),
        prec.right(0, seq(choice("car", "cdr", "frst", "scnd"), $.expression)),
      ),

    binary_expression: ($) =>
      choice(
        prec.left(13, seq($.expression, "|>", $.expression)),
        prec.left(11, seq($.expression, "^", $.expression)),
        prec.left(10, seq($.expression, choice("*", "/", "%"), $.expression)),
        prec.left(9, seq($.expression, choice("+", "-"), $.expression)),
        prec.left(
          8,
          seq($.expression, choice("<", ">", "<=", ">=", "in"), $.expression),
        ),
        prec.left(7, seq($.expression, choice("==", "!="), $.expression)),
        prec.left(6, seq($.expression, "and", $.expression)),
        prec.left(5, seq($.expression, "or", $.expression)),
        prec.right(3, seq($.expression, choice(".", "..", ","), $.expression)),
        prec.left(2, seq($.expression, $._operator, $.expression)),
        seq("cons", $.expression, $.expression),
      ),

    if_statement: ($) =>
      prec(
        4,
        seq("if", $.expression, "then", $.expression, "else", $.expression),
      ), //if then else

    match: ($) =>
      prec.right(seq("match", alias($.expression, $.pivot), repeat($.case))),

    case: ($) => seq("|", $.expression, "=>", $.expression),

    literal: ($) =>
      choice(
        $.unit,
        $.number,
        $.boolean,
        $.string,
        $.fstring,
        $.character,
        $.map,
        $.list,
        $.identifier,
        $.glyph,
      ),
    unit: ($) => choice("{}", "unit"),
    number: ($) => /\d+(\.\d+)?([eE][+-]?\d+)?/,
    boolean: ($) => choice("true", "false"),
    string: ($) => seq('"', /[^\"]*?/, '"'),

    fstring: ($) => seq('f"', repeat(choice($.escape_sequence, /[^\"]/)), '"'),
    escape_sequence: ($) =>
      seq("\\", choice("\\", '"', "n", "t", "b", "f", "\n")),

    character: ($) => seq("'", choice($.char_escape, /[^\']/), "'"),
    char_escape: ($) => seq("\\", choice("\\", "'", "n", "t", "b", "f", "\n")),

    map: ($) =>
      choice(
        "[=>]",
        seq("[", separated_with(seq($.string, "=>", $.expression), ";"), "]"),
      ),

    list: ($) =>
      seq("[", choice(";", optional(separated_with($.expression, ";"))), "]"),

    identifier: ($) => /[a-zA-Z]([a-zA-Z0-9_])*/,

    glyph: ($) => seq("`", $._operator),
    _operator: ($) => /[\:\|\^\*%\+\-!\?><@#\$~&\.=\\/]+/,

    comment: ($) => token(seq("//", /.*/)),
    semicolon: ($) => ";",
  },
});

function separated_with(expr, separator) {
  return seq(optional(separator), repeat1(seq(expr, optional(separator))));
}
