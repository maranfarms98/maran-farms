/**
 * Translates a camelCase request body into a snake_case column update,
 * including only the fields the caller actually sent.
 */
export function applyFieldMap(body, fieldMap) {
  const update = {};
  for (const [key, column] of Object.entries(fieldMap)) {
    if (body[key] !== undefined) update[column] = body[key];
  }
  return update;
}
