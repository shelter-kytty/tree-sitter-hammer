/**
 * @file A tree-sitter parser for hammer
 * @author shelter-kytty <152751739+shelter-kytty@users.noreply.github.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hammer",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
