// POSIX single-quoting: wraps in '...' and escapes any literal single quote
// as '\''. Safe for paths with spaces, which S3 keys commonly have.
export function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}
