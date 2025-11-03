/**
 * @file A tree-sitter parser for hammer
 * @author shelter-kytty <152751739+shelter-kytty@users.noreply.github.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hammer",

  conflicts: ($) => [[$.binary_expression, $.deconstruct]],

  word: ($) => $.identifier,

  extras: ($) => [
    /\s/, //whitespace
    $.comment,
  ],

  rules: {
    source_file: ($) => repeat($._definition),

    _definition: ($) =>
      choice($.function_definition, $.name_definition, $.expression),

    function_definition: ($) =>
      seq(
        field("name", $.identifier),
        field("parameters", $.parameter_list),
        field("body", $.block),
      ),

    parameter_list: ($) => seq(":", repeat($.identifier), "="),

    block: ($) => seq("{", repeat($._definition), "}"),

    name_definition: ($) => seq($.identifier, "=", $.expression),

    expression: ($) =>
      choice(
        $.block,
        $.if_statement,
        $.lambda,
        $.binary_expression,
        $.unary_expression,
        $.literal,
        $.identifier,
      ),

    identifier: ($) => /[a-zA-Z]+([a-zA-Z0-9_])*/,

    literal: ($) => choice($.unit, $.number, $.boolean, $.string),
    unit: ($) => choice("{}", "unit"),
    number: ($) => /\d+/,
    boolean: ($) => choice("true", "false"),
    string: ($) => seq('"', /[^\"]/, '"'),

    unary_expression: ($) =>
      choice(
        prec.left(12, seq("-", $.expression)),
        prec.left(12, seq("!", $.expression)),
      ),

    binary_expression: ($) =>
      choice(
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
        prec.left(3, seq($.expression, choice(".", ","), $.expression)),
      ),

    deconstruct: ($) => seq($.expression, ",", $.expression),

    if_statement: ($) =>
      seq("if", $.expression, "then", $.expression, "else", $.expression), //if then else
    lambda: ($) => seq("_", $.parameter_list, $.expression), //lambda
    comment: ($) => token(seq("//", /.*/)),
  },
});
