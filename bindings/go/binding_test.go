package tree_sitter_hammer_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_hammer "github.com/shelter-kytty/tree-sitter-hammer/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_hammer.Language())
	if language == nil {
		t.Errorf("Error loading Hammer grammar")
	}
}
