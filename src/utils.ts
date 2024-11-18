export const listResponse = <T>(list: T[]) => ({
  data: list,
  count: list.length,
});
