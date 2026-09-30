import { describe, expect, it } from 'vitest'
import { convert, formats } from './formats'

const format = (name: string) => formats.find((f) => f.name === name)!
const [json, yaml, toml] = ['JSON', 'YAML', 'TOML'].map(format)

describe('convert', () => {
  const sample = '{"name":"tools","port":8081,"tags":["dev","web"],"db":{"host":"localhost","ssl":true}}'

  it('converts JSON to YAML and TOML', () => {
    expect(convert(sample, json, yaml)).toBe('name: tools\nport: 8081\ntags:\n  - dev\n  - web\ndb:\n  host: localhost\n  ssl: true\n')
    expect(convert(sample, json, toml)).toBe(
      'name = "tools"\nport = 8081\ntags = [ "dev", "web" ]\n\n[db]\nhost = "localhost"\nssl = true\n',
    )
  })

  it('round-trips through every format', () => {
    for (const via of [yaml, toml]) {
      expect(JSON.parse(convert(convert(sample, json, via), via, json))).toEqual(JSON.parse(sample))
    }
  })

  it('keeps integers beyond 2^53 exact', () => {
    const big = '{"id":12345678901234567890}'
    expect(convert(convert(big, json, yaml), yaml, json)).toBe('{\n  "id": 12345678901234567890\n}')
    expect(convert(convert(big, json, toml), toml, json)).toBe('{\n  "id": 12345678901234567890\n}')
  })

  it('refuses what TOML cannot represent instead of dropping it', () => {
    expect(() => convert('[1,2]', json, toml)).toThrow('TOML needs an object at the top level')
    expect(() => convert('{"a":{"b":[1,null]}}', json, toml)).toThrow('found one at a.b[1]')
  })

  it('gives one-line, user-facing parse errors', () => {
    expect(() => convert('a: 1\n---\nb: 2', yaml, json)).toThrow('Only single-document YAML is supported')
    expect(() => convert('a = ', toml, json)).toThrow(/^Invalid TOML document: invalid value$/)
    expect(() => convert('a: [1, 2', yaml, json)).toThrow(/at line 1, column 9$/)
  })
})
