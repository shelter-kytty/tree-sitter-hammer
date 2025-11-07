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

  externals: ($) => [$.application_params],

  extras: ($) => [
    /\s/, //whitespace
    $.comment,
  ],

  rules: {
    source_file: ($) => repeat($._statememt),

    _statememt: ($) => choice($.function, $.name_definition, $._expression),

    function: ($) =>
      prec(
        1,
        seq(
          field("name", $.identifier),
          field("parameters", $.parameter_list),
          field("body", $._expression),
        ),
      ),

    parameter_list: ($) => seq(":", repeat($.identifier), "="),

    name_definition: ($) =>
      prec.right(
        1,
        seq($.identifier, repeat(seq(",", $.identifier)), "=", $._expression),
      ),

    _expression: ($) =>
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

    application: ($) =>
      prec(14, seq($._expression, "(", $.application_params, ")")),

    lambda: ($) => prec(1, seq("_", $.parameter_list, $._expression)), //lambda

    if_statement: ($) =>
      prec(
        4,
        seq("if", $._expression, "then", $._expression, "else", $._expression),
      ), //if then else

    unary_expression: ($) =>
      choice(
        prec.left(12, seq("-", $._expression)),
        prec.left(12, seq("!", $._expression)),
      ),

    binary_expression: ($) =>
      choice(
        prec.left(11, seq($._expression, "^", $._expression)),
        prec.left(10, seq($._expression, choice("*", "/", "%"), $._expression)),
        prec.left(9, seq($._expression, choice("+", "-"), $._expression)),
        prec.left(
          8,
          seq($._expression, choice("<", ">", "<=", ">="), $._expression),
        ),
        prec.left(7, seq($._expression, choice("==", "!="), $._expression)),
        prec.left(6, seq($._expression, "and", $._expression)),
        prec.left(5, seq($._expression, "or", $._expression)),
        prec.right(3, seq($._expression, choice(".", ","), $._expression)),
      ),

    literal: ($) =>
      choice($.unit, $.number, $.boolean, $.string, $.fstring, $.identifier),
    identifier: ($) => /[a-zA-Z]+([a-zA-Z0-9_])*/,
    unit: ($) => choice("{}", "unit"),
    number: ($) => /\d+/,
    boolean: ($) => choice("true", "false"),
    string: ($) => seq('"', /[^\"]*?/, '"'),
    fstring: ($) => seq('f"', /[^\"]*?/, '"'),

    comment: ($) => token(seq("//", /.*/)),
    semicolon: ($) => ";",
  },
});
