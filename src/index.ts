export { find as findHobbies } from './hobbies'
export function exit(message?: string, code?: number): never {
  console.error(message)
  process.exit(code)
}
