export const transformImportContactData = (rows: any[]) =>
  rows.map((row, index) => ({
    _id: index,
    full_name: row.full_name ?? row.fullName ?? "",
    email: row.email ?? row.emailAddress ?? "",
    phone_number: row.phone_number ?? row.phone ?? "",
    tags: Array.isArray(row.tags) ? row.tags : [],
  }));
