import XCTest
import SwiftTreeSitter
import TreeSitterBauble

final class TreeSitterBaubleTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_bauble())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Bauble grammar")
    }
}
