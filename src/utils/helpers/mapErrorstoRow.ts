export const mapApiErrorsToRows = (errData: Record<string, string[]>) => {
  const mappedErrors: Record<number, Record<string, string>> = {};

  Object.entries(errData).forEach(([key, messages]) => {
    const match = key.match(/^contacts\.(\d+)\.(\w+)$/);
    if (!match) return;

    const rowIndex = parseInt(match[1], 10);
    const column = match[2];

    mappedErrors[rowIndex] = {
      ...mappedErrors[rowIndex],
      [column]: messages.join(", "),
    };
  });

  console.log(mappedErrors);

  return mappedErrors;
};
