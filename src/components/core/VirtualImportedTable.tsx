import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CircleCheck, Edit3, PenLine, Trash2, X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import DeleteDialog from "./DeleteDialog";

interface VirtualImportedTableProps {
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  errors: any;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  search?: string;
}

const VirtualImportedTable: React.FC<VirtualImportedTableProps> = ({
  data,
  setData,
  errors,
  setErrors,
  search,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const [editingCell, setEditingCell] = useState<{
    rowId: string;
    columnId: string;
  } | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const [tempRow, setTempRow] = useState<any | null>(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const columnLabels = {
    full_name: "Full Name",
    email: "Email",
    phone_number: "Phone",
    tags: "Tags",
  };

  const columns = useMemo(() => {
    if (!data || !data.length) return [];
    return [
      ...Object.keys(data[0])
        .filter((key) => key !== "_id")
        .map((key) => ({
          accessorKey: key,
          header: columnLabels[key] || key,
          size: 348,
        })),
      { id: "actions", header: "Actions", size: 100 },
    ];
  }, [data]);

  const filteredData = useMemo(() => {
    if (!search || !search.trim()) return data;
    const lowerSearch = search.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(lowerSearch)
      )
    );
  }, [data, search]);

  const emailCountMap = useMemo(() => {
    const map = new Map<string, number>();
    data?.forEach((row) => {
      const email = row.email?.toLowerCase();
      if (!email) return;
      map.set(email, (map.get(email) || 0) + 1);
    });
    return map;
  }, [data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const validators: Record<
    string,
    (value: any, row?: Record<string, any>) => string | null
  > = {
    full_name: (v) => (!v ? "Full Name is required" : null),
    email: (v) => {
      if (!v) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email format";
      const emailLower = v.toLowerCase();
      if ((emailCountMap.get(emailLower) || 0) > 1)
        return "Duplicate email found";
      return null;
    },
    phone_number: (v) =>
      !/^(\+614|04)\d{8}$/.test(v) ? "Invalid phone number" : null,
    tags: (v) => {
      const tagsArray = Array.isArray(v) ? v : String(v).split(",");
      for (const tag of tagsArray) {
        if (!/^[a-zA-Z0-9]+$/.test(tag.trim())) {
          return "Tags must contain only letters and numbers (no spaces)";
        }
      }
      return null;
    },
  };

  useEffect(() => {
    const newErrors: Record<string, Record<string, string>> = {};

    data.forEach((row) => {
      const rowErrors: Record<string, string> = {};
      Object.keys(validators).forEach((key) => {
        const validator = validators[key];
        if (validator) {
          const err = validator(row[key], row);
          if (err) rowErrors[key] = err;
        }
      });
      if (Object.keys(rowErrors).length) newErrors[row._id] = rowErrors;
    });

    setErrors(newErrors);
  }, [data]);

  const handleRemoveRow = (rowId: string) => {
    setData((prevData) => prevData.filter((row) => row._id !== rowId));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[rowId];
      return newErrors;
    });
    setIsDeleteOpen(false);
  };

  const startEditing = (rowId: string, columnId: string) => {
    const actualRow = data.find((r) => r._id === rowId);
    if (!actualRow) return;

    setEditingCell({ rowId, columnId });
    setTempRow({ ...actualRow });
  };

  const handleChange = (key: string, value: any) => {
    if (!tempRow) return;
    const updatedTempRow = { ...tempRow, [key]: value };
    setTempRow(updatedTempRow);

    const validator = validators[key];
    const errorMsg = validator ? validator(value, updatedTempRow) : null;

    if (editingCell) {
      setErrors((prev) => ({
        ...prev,
        [editingCell.rowId]: {
          ...(prev[editingCell.rowId] || {}),
          [key]: errorMsg || "",
        },
      }));
    }
  };

  const saveRowChanges = (rowId: string) => {
    if (!tempRow) return;

    let updatedRow = { ...tempRow };

    if (updatedRow.tags) {
      if (typeof updatedRow.tags === "string") {
        updatedRow.tags = updatedRow.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean);
      }
    } else {
      updatedRow.tags = [];
    }

    setData((prev) =>
      prev.map((row) => (row._id === rowId ? { ...row, ...updatedRow } : row))
    );

    console.log("Saved changes:", updatedRow);

    setEditingRowId(null);
    setEditingCell(null);
    setTempRow(null);
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditingRowId(null);
    setTempRow(null);
  };

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 50,
    overscan: 10,
  });

  const totalWidth = useMemo(
    () => columns.reduce((acc, col) => acc + col.size, 0),
    [columns]
  );

  useEffect(() => {
    if (headerRef.current)
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
  }, [columns]);

  return (
    <div
      ref={containerRef}
      className="overflow-auto w-full min-w-full h-full relative"
    >
      <div style={{ width: totalWidth, position: "relative" }}>
        <table
          className="table-fixed w-full border-separate"
          style={{ width: totalWidth, borderSpacing: 0 }}
        >
          <thead ref={headerRef} className="bg-gray-100 sticky top-0 z-10 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`border px-4 py-3 text-left text-sm font-normal whitespace-nowrap ${
                      header.column.id === "actions"
                        ? "sticky right-0 z-10 bg-gray-100"
                        : ""
                    }`}
                    style={{
                      minWidth: `${header.column.columnDef.size}px`,
                      maxWidth: `${header.column.columnDef.size}px`,
                      width: `${header.column.columnDef.size}px`,
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            <tr>
              <td
                colSpan={columns.length}
                style={{ height: rowVirtualizer.getTotalSize() }}
              />
            </tr>

            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index];
              return (
                <tr
                  key={row.id}
                  data-row-index={virtualRow.index}
                  style={{
                    position: "absolute",
                    top: headerHeight,
                    transform: `translateY(${virtualRow.start}px)`,
                    width: totalWidth,
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const cellError =
                      errors?.[row.original._id]?.[cell.column.id] || null;

                    return (
                      <td
                        key={cell.id}
                        className={`border border-gray-200 h-[50px] px-4 py-1 text-xs whitespace-nowrap group relative hover:bg-sky-50 items-center ${
                          cell.column.id === "actions"
                            ? "sticky right-0 z-30 bg-white border-b border-t border-l border-gray-300"
                            : ""
                        } ${cellError ? "border-red-500 bg-red-50" : ""}`}
                        style={{
                          minWidth: `${cell.column.columnDef.size}px`,
                          maxWidth: `${cell.column.columnDef.size}px`,
                          width: `${cell.column.columnDef.size}px`,
                        }}
                        onDoubleClick={() =>
                          !editingRowId &&
                          startEditing(row.original._id, cell.column.id)
                        }
                      >
                        {cell.column.id !== "actions" && (
                          <div className="absolute top-4 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Edit3 className="w-4 h-4 text-gray-400 cursor-pointer" />
                          </div>
                        )}
                        {cell.column.id === "actions" ? (
                          <div className="flex gap-2">
                            <Trash2
                              className="cursor-pointer w-4 h-4"
                              onClick={() => {
                                setIsDeleteOpen(true);
                                setDeleteId(row.original._id);
                              }}
                            />
                          </div>
                        ) : editingRowId === row.original._id ? (
                          <input
                            className="w-3/4 text-xs py-1 border rounded px-1"
                            value={
                              cell.column.id === "tags"
                                ? Array.isArray(tempRow?.tags)
                                  ? tempRow.tags.join(", ")
                                  : (tempRow?.tags ?? "")
                                : (tempRow?.[cell.column.id] ?? "")
                            }
                            onChange={(e) => {
                              let value: string | string[] = e.target.value;

                              if (cell.column.id === "phone_number") {
                                let phone = (value as string)
                                  .replace(/[^\d+]/g, "")
                                  .replace(/(?!^)\+/g, "");

                                if (phone.startsWith("04")) {
                                  phone = phone.slice(0, 10);
                                } else if (phone.startsWith("+61")) {
                                  phone = phone.slice(0, 12);
                                }

                                value = phone;
                              }

                              handleChange(cell.column.id, value);
                            }}
                          />
                        ) : editingCell?.rowId === row.original._id &&
                          editingCell?.columnId === cell.column.id ? (
                          <input
                            className="w-3/4 text-xs py-1 border rounded px-1"
                            value={
                              cell.column.id === "tags"
                                ? Array.isArray(tempRow?.tags)
                                  ? tempRow.tags.join(", ")
                                  : (tempRow?.tags ?? "")
                                : (tempRow?.[cell.column.id] ?? "")
                            }
                            onChange={(e) =>
                              handleChange(cell.column.id, e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                saveRowChanges(row.original._id);
                              if (e.key === "Escape") cancelEditing();
                            }}
                            onBlur={() => saveRowChanges(row.original._id)}
                            autoFocus
                          />
                        ) : (
                          <div className="flex flex-col">
                            <div
                              title={String(cell.getValue() ?? "")}
                              className="truncate cursor-default"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                            {cellError && (
                              <span className="text-red-600 text-[10px] mt-1 block">
                                {cellError}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <DeleteDialog
        isDeleteOpen={isDeleteOpen}
        setDeleteClose={setIsDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => handleRemoveRow(deleteId)}
        type="Delete"
      >
        <div className="space-y-4">
          <div>{`Are you sure you want to Delete this contact? `}</div>
        </div>
      </DeleteDialog>
    </div>
  );
};

export default VirtualImportedTable;
