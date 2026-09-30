import { describe, expect, it } from 'vitest'
import { formatJson } from './format'

describe('formatJson', () => {
  const input = '{"b":[1,{"d":true,"c":null}],"a":"x"}'

  it('indents with spaces or tabs, or minifies', () => {
    expect(formatJson(input, '2 spaces', false)).toBe(
      '{\n  "b": [\n    1,\n    {\n      "d": true,\n      "c": null\n    }\n  ],\n  "a": "x"\n}',
    )
    expect(formatJson(input, 'Tab', false)).toContain('\n\t"b": [\n\t\t1,')
    expect(formatJson(' { "a" : 1 } ', 'Minified', false)).toBe('{"a":1}')
  })

  it('sorts keys recursively, leaving array order alone', () => {
    expect(formatJson(input, 'Minified', true)).toBe('{"a":"x","b":[1,{"c":null,"d":true}]}')
  })

  it('keeps numbers exactly as written', () => {
    expect(formatJson('{"id":12345678901234567890,"price":1.50,"big":1e400}', 'Minified', true)).toBe(
      '{"big":1e400,"id":12345678901234567890,"price":1.50}',
    )
  })

  it('throws the parser error on invalid JSON', () => {
    expect(() => formatJson('{"a":1,}', '2 spaces', false)).toThrow(/line 1 column 8/)
  })
})
