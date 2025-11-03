import XCTest
import SwiftTreeSitter
import TreeSitterHammer

final class TreeSitterHammerTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_hammer())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Hammer grammar")
    }
}
