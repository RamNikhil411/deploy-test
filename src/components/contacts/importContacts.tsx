import { ContactContext } from "@/context/contactContext";
import { fileParse } from "@/utils/helpers/fileParse";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Info, InfoIcon, X } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { AppToast } from "../core/customToast";
import SearchFilter from "../core/SearchFilter";
import VirtualImportedTable from "../core/VirtualImportedTable";
import { importContactAPI } from "../https/services/contacts";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { RippleButton } from "../ui/shadcn-io/ripple-button";
import { ExistingContactsAlert } from "../core/warningDialog";
import { transformImportContactData } from "@/utils/helpers/transformImportContacts";
import { mapApiErrorsToRows } from "@/utils/helpers/mapErrorstoRow";
import NoContactIcon from "../ui/icons/contacts/NoContactsIcon";
import CancelDialog from "../core/CancelDialog";

const ImportContacts = () => {
  const navigate = useNavigate();
  const { activeOrganization } = useContext(ContactContext);

  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>(
    {}
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [existingContacts, setExistingContacts] = useState<any[]>([]);
  const [newContacts, setNewContacts] = useState<any[]>([]);
  const [finalSummary, setFinalSummary] = useState<any>(null);
  const [editingExisting, setEditingExisting] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);

  const onDrop = async (
    acceptedFiles: File[],
    fileRejections: FileRejection[]
  ) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      AppToast.error({
        message: "File is too large. Maximum allowed size is 25 MB.",
      });
      return;
    }

    try {
      const parsedData = await fileParse([file]);
      setData(transformImportContactData(parsedData));
    } catch (err: any) {
      console.error(err.message);
      AppToast.error({ message: err.message });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxSize: 25 * 1024 * 1024,
  });

  const { mutate: importContacts, isPending } = useMutation({
    mutationKey: ["importContacts"],
    mutationFn: async (payload: any) => {
      const response = await importContactAPI(payload);
      return response;
    },
    onSuccess: (response) => {
      const resData = response?.data?.data || {};
      const {
        new_contacts = [],
        existed_contacts = [],
        total_contacts,
      } = resData;

      setNewContacts(new_contacts);
      setExistingContacts(existed_contacts);
      setFinalSummary({
        total: total_contacts,
        newCount: new_contacts?.length ?? 0,
        existedCount: existed_contacts?.length ?? 0,
      });

      setEditingExisting(false);

      if (response?.status === 200 || response?.status === 201) {
        setDialogOpen(false);
      } else {
        setDialogOpen(true);
      }
      navigate({ to: "/contacts" });
      AppToast.success({ message: "Contacts imported successfully." });
    },
    onError: (response: any) => {
      const { err_code, err_data, message } = response?.data || {};

      if (err_code === "409_CONFLICT" || err_code === "400_BAD_REQUEST") {
        const {
          existed_contacts = [],
          new_contacts = [],
          total_contacts,
        } = err_data || {};

        setExistingContacts(existed_contacts || []);
        setNewContacts(new_contacts || []);
        setFinalSummary({
          total: total_contacts,
          newCount: (new_contacts || [])?.length ?? 0,
          existedCount: (existed_contacts || [])?.length ?? 0,
        });
        setEditingExisting(false);
        setDialogOpen(true);
      } else {
        const apiErrors = mapApiErrorsToRows(err_data);
        setErrors(apiErrors);
        AppToast.error({ message: message || "Failed to import contacts." });
      }
    },
  });

  const handleSubmit = () => {
    if (!data) return;

    let payloadRows = data.map(({ _id, ...rest }: any) => rest);
    if (editingExisting && newContacts && newContacts.length > 0) {
      payloadRows = [
        ...payloadRows,
        ...newContacts.map(({ _id, ...rest }: any) => rest),
      ];
    }

    importContacts({
      contacts: payloadRows,
      organization_id: activeOrganization,
      confirm_import: false,
    });
  };

  const handleConfirmImport = () => {
    let payloadRows: any[] = [];
    if (editingExisting) {
      payloadRows = [
        ...data.map(({ _id, ...rest }: any) => rest),
        ...newContacts.map(({ _id, ...rest }: any) => rest),
      ];
    } else if (newContacts && newContacts.length > 0) {
      payloadRows = newContacts.map(({ _id, ...rest }: any) => rest);
    } else {
      payloadRows = data?.map(({ _id, ...rest }: any) => rest) || [];
    }

    importContacts({
      contacts: payloadRows,
      organization_id: activeOrganization,
      confirm_import: true,
    });

    setDialogOpen(false);
    setEditingExisting(false);
  };

  const handleEditExisting = () => {
    const updatedData = transformImportContactData(existingContacts);
    setData(updatedData);
    setEditingExisting(true);
    setDialogOpen(false);
  };

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const lowerSearch = search.toLowerCase();
    return data?.filter((row: any) =>
      Object.values(row).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(lowerSearch)
      )
    );
  }, [data, search]);

  const handleCancel = () => {
    navigate({ to: "/contacts" });
    setData(null);
    setSearch("");
  };
  return (
    <div className="p-4">
      {data?.length > 0 && showBanner && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <strong>Review and edit contacts below.</strong> Double-click any
              cell to make changes. Hover over cells to see the edit icon.
            </div>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="shadow-none hover:shadow-none cursor-pointer"
            onClick={() => navigate({ to: "/contacts" })}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>Import Contacts</h1>
          {data && (
            <p className="text-xs font-light bg-gray-200 py-1 px-2">
              {data?.length}
            </p>
          )}
        </div>
        {data?.length > 0 && (
          <SearchFilter
            searchString={search}
            setSearchString={setSearch}
            title="Search by name or email"
          />
        )}
      </div>

      <div className="mt-4">
        {data && data.length > 0 ? (
          <div className="space-y-4">
            <div
              className={` ${showBanner ? "h-[calc(100vh-285px)]" : "h-[calc(100vh-220px)]"}  flex items-center justify-center`}
            >
              {filteredData && filteredData.length > 0 ? (
                <VirtualImportedTable
                  data={filteredData}
                  setData={setData}
                  search={search}
                  setErrors={setErrors}
                  errors={errors}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <NoContactIcon />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <RippleButton
                onClick={() => {
                  setCancelDialogOpen(true);
                }}
                className="bg-white hover:bg-white text-black text-xs border rounded shadow-none py-1 h-fit !px-3 font-normal"
              >
                Cancel
              </RippleButton>
              <RippleButton
                type="submit"
                className="bg-lime-600 hover:bg-green-700 text-white text-xs border rounded shadow-none py-1 h-fit !px-3 font-normal"
                onClick={handleSubmit}
                disabled={isPending}
              >
                Submit
              </RippleButton>
            </div>
          </div>
        ) : (
          <Card className="w-full max-w-2xl mx-auto !p-4">
            <CardHeader className="space-y-2 rounded bg-sky-50 p-2">
              <CardTitle className="text-sm font-medium">
                Preparing your CSV
              </CardTitle>
              <CardDescription className="space-y-2 text-xs">
                <ul className="list-disc pl-5 marker:text-gray-400">
                  <li>
                    Use a CSV file with columns: Full Name, Email, Phone, Tags
                  </li>
                  <li>Separate multiple values (like Tags) using commas</li>
                </ul>
                <a
                  href="/contacts_template.csv"
                  download="contacts_template.csv"
                  className="text-blue-400 underline text-xs cursor-pointer"
                >
                  Download CSV Template
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent
              {...getRootProps()}
              className="space-y-1 border-1 cursor-pointer border-dashed rounded bg-gray-100 p-4 flex flex-col items-center justify-center"
            >
              <Label htmlFor="file" className="text-sm font-normal">
                Drag and Drop your files here
              </Label>
              <input {...getInputProps()} />
              <span className="text-xs">Max Size : 25MB</span>
              <RippleButton
                type="submit"
                className="bg-transparent hover:bg-transparent text-black text-xs border rounded shadow-none py-1 h-fit !px-3 font-normal"
              >
                Choose File
              </RippleButton>
            </CardContent>
          </Card>
        )}
      </div>

      <ExistingContactsAlert
        open={dialogOpen}
        importedContactsCount={newContacts?.length ?? 0}
        existedContacts={existingContacts}
        totalContacts={finalSummary?.total ?? 0}
        onClose={() => setDialogOpen(false)}
        onContinue={handleConfirmImport}
        onEdit={existingContacts.length > 0 ? handleEditExisting : undefined}
      />
      <CancelDialog
        open={cancelDialogOpen}
        setOpen={setCancelDialogOpen}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ImportContacts;
