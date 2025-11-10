/**
 * @file A tree-sitter parser for hammer
 * @author shelter-kytty <152751739+shelter-kytty@users.noreply.github.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hammer",

  // conflicts: ($) => [[$.binary_expression, $.decons]],

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
        field("name", $.identifier),
        field("parameters", $.parameter_list),
        field("body", $.expression),
      ),

    parameter_list: ($) => seq(":", repeat($.identifier), "="),

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

    return: ($) => seq("return", $.expression),

    expression: ($) =>
      choice(
        $.block,
        $.application,
        $.if_statement,
        $.lambda,
        $.unary_expression,
        $.binary_expression,
        $.literal,
      ),

    block: ($) => seq("{", repeat($._statememt), "}"),

    lambda: ($) => seq("_", $.parameter_list, $.expression), //lambda

    application: ($) =>
      prec(
        14,
        seq(field("callable", $.expression), field("args", $.arguments)),
      ),

    arguments: ($) =>
      seq("(", optional(choice(";", separated_with($.expression, ";"))), ")"),

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
          seq($.expression, choice("<", ">", "<=", ">="), $.expression),
        ),
        prec.left(7, seq($.expression, choice("==", "!="), $.expression)),
        prec.left(6, seq($.expression, "and", $.expression)),
        prec.left(5, seq($.expression, "or", $.expression)),
        prec.right(3, seq($.expression, choice(".", "..", ","), $.expression)),
        seq("cons", $.expression, $.expression),
      ),

    if_statement: ($) =>
      prec(
        4,
        seq("if", $.expression, "then", $.expression, "else", $.expression),
      ), //if then else

    literal: ($) =>
      choice(
        $.unit,
        $.number,
        $.boolean,
        $.string,
        $.fstring,
        $.map,
        $.list,
        $.identifier,
      ),
    identifier: ($) => /[a-zA-Z]([a-zA-Z0-9_])*/,
    unit: ($) => choice("{}", "unit"),
    number: ($) => /\d+/,
    boolean: ($) => choice("true", "false"),
    string: ($) => seq('"', /[^\"]*?/, '"'),
    fstring: ($) => seq('f"', /[^\"]*?/, '"'),
    map: ($) =>
      choice(
        "[=>]",
        seq("[", separated_with(seq($.string, "=>", $.expression), ";"), "]"),
      ),
    list: ($) =>
      seq("[", choice(";", optional(separated_with($.expression, ";"))), "]"),

    comment: ($) => token(seq("//", /.*/)),
    semicolon: ($) => ";",
  },
});

function separated_with(expr, separator) {
  return seq(optional(separator), repeat1(seq(expr, optional(separator))));
}
