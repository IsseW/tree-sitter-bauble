#include "tree_sitter/parser.h"
#include <stdio.h>
#include <wctype.h>

enum TokenType {
  STR,
  RAW,
  LITERAL,
};

void *tree_sitter_bauble_external_scanner_create() { return NULL; }
void tree_sitter_bauble_external_scanner_destroy(void *p) {}
void tree_sitter_bauble_external_scanner_reset(void *p) {}
unsigned tree_sitter_bauble_external_scanner_serialize(void *p, char *buffer) { return 0; }
void tree_sitter_bauble_external_scanner_deserialize(void *p, const char *b, unsigned n) {}

static void advance(TSLexer *lexer) {
  lexer->advance(lexer, false);
}

static bool is_num_char(int32_t c) {
  return c == '_' || iswdigit(c);
}

bool tree_sitter_bauble_external_scanner_scan(void *payload, TSLexer *lexer,
                                            const bool *valid_symbols) {
  while (iswspace(lexer->lookahead)) lexer->advance(lexer, true);

  if (valid_symbols[STR] && lexer->lookahead == '"') {
    lexer->result_symbol = STR;
    advance(lexer);
    for (;;) {
      if (lexer->lookahead == '"') {
        advance(lexer);
        return true;
      } else if (lexer->lookahead == 0) {
        return false;
      } else if (lexer->lookahead == '\\') {
        advance(lexer);

        if (lexer->lookahead == '\\'
         || lexer->lookahead == '/'
         || lexer->lookahead == '"'
         || lexer->lookahead == 'b'
         || lexer->lookahead == 'f'
         || lexer->lookahead == 'n'
         || lexer->lookahead == 'r'
         || lexer->lookahead == 't'
        ) {
          advance(lexer);
        } else if (lexer->lookahead == 'u') {
          advance(lexer);
          for (size_t i = 0; i < 4; ++i) {
            if ((lexer->lookahead >= '0' && lexer->lookahead <= '9')
            || (lexer->lookahead >= 'a' && lexer->lookahead <= 'f')
            || (lexer->lookahead >= 'A' && lexer->lookahead <= 'F')) {
              advance(lexer);
            } else {
              return false;
            }
          }
          // TODO: Could check if the code-point is valid here too.
        } else {
          return false;
        }
      } else {
        advance(lexer);
      }
    }
  }

  if (valid_symbols[LITERAL] && lexer->lookahead == '#') {
    lexer->result_symbol = LITERAL;
    advance(lexer);
    bool has_content = false;
    for (;;) {
      if (lexer->lookahead == 0) {
        break;
      }

      if ((lexer->lookahead >= 'a' && lexer->lookahead <= 'z')
      || (lexer->lookahead >= 'A' && lexer->lookahead <= 'Z')
      || (lexer->lookahead >= '0' && lexer->lookahead <= '9')
      || lexer->lookahead == '!' || lexer->lookahead == '#'
      || lexer->lookahead == '@' || lexer->lookahead == '%'
      || lexer->lookahead == '&' || lexer->lookahead == '?'
      || lexer->lookahead == '.' || lexer->lookahead == '='
      || lexer->lookahead == '<' || lexer->lookahead == '>'
      || lexer->lookahead == '_' || lexer->lookahead == '-'
      || lexer->lookahead == '+' || lexer->lookahead == '*') {
        has_content = true;
        advance(lexer);
      } else {
        break;
      }
      
    }

    return has_content;
  }

  if (
    valid_symbols[RAW] &&
    lexer->lookahead == '{'
  ) {
    advance(lexer);
    lexer->result_symbol = RAW;

    unsigned opening_count = 1;
    while (lexer->lookahead == '{') {
      advance(lexer);
      opening_count++;
    }

    for (;;) {
      if (lexer->lookahead == 0) {
        return false;
      } else if (lexer->lookahead == '}') {
        advance(lexer);
        unsigned closing_count = 1;
        while (lexer->lookahead == '}' && closing_count < opening_count) {
          advance(lexer);
          closing_count++;
        }
        if (closing_count == opening_count) {
          return true;
        }
      } else {
        advance(lexer);
      }
    }
  }

  return false;
}
