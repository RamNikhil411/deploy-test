import Papa from "papaparse";

interface Region {
  id: number;
  name: string;
}

interface Organization {
  id: number;
  name: string;
}

export const fileParse = (
  File: File[],
  regions: Region[] = [],
  organizations: Organization[] = []
): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(File[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        try {
          const transformed = (results.data as Record<string, any>[]).map(
            (row) => {
              const newRow: Record<string, any> = {
                full_name: row["Full Name"] ?? row["full_name"] ?? "",
                email: row["Email"] ?? row["email"] ?? "",
                phone_number: row["Phone"] ?? row["phone_number"] ?? "",
                tags:
                  row["Tags"]?.split(",").map((t: string) => t.trim()) ?? [],
              };
              return newRow;
            }
          );

          const hasData = transformed.some((row) =>
            Object.values(row).some((value) => value !== "" && value != null)
          );

          if (!hasData) {
            reject(new Error("Oops! The file seems empty"));
            return;
          }

          resolve(transformed);
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => reject(error),
    });
  });
};
