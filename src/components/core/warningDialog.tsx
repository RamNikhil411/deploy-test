import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Users, CheckCircle2, AlertCircle, Edit3, XCircle } from "lucide-react";

interface ExistingContactsAlertProps {
  existedContacts: any[];
  importedContactsCount: number;
  open: boolean;
  onClose: () => void;
  totalContacts: number;
  onContinue: () => void; // called when user confirms import
  onEdit?: () => void; // edit existing contacts
}

export const ExistingContactsAlert: React.FC<ExistingContactsAlertProps> = ({
  open,
  onClose,
  totalContacts,
  importedContactsCount,
  existedContacts,
  onContinue,
  onEdit,
}) => {
  const existingCount = existedContacts?.length ?? 0;
  console.log(
    existingCount,
    totalContacts,
    importedContactsCount,
    "contacts count"
  );

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Import Summary</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 pt-2">
              {/* Total contacts */}
              <div className="flex items-center gap-3 p-3 bg-sky-50 border border-sky-200 rounded-lg">
                <Users className="h-5 w-5 text-sky-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-sky-900">
                    Total contacts in file:{" "}
                    <span className="font-bold">{totalContacts}</span>
                  </p>
                </div>
              </div>

              {/* New contacts */}
              {(importedContactsCount > 0 ||
                totalContacts === importedContactsCount) && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      <span className="font-bold">{importedContactsCount}</span>{" "}
                      new {importedContactsCount === 1 ? "contact" : "contacts"}{" "}
                      ready to import
                    </p>
                  </div>
                </div>
              )}

              {/* Existing contacts */}
              {existingCount > 0 && (
                <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      <span className="font-bold">{existingCount}</span>{" "}
                      {existingCount === 1 ? "contact" : "contacts"} already
                      exist
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      You can edit these before confirming import.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Cancel
          </AlertDialogCancel>

          {existingCount > 0 && (
            <AlertDialogAction
              onClick={onEdit}
              className="flex items-center gap-2 bg-amber-100 text-amber-900 hover:bg-amber-200"
            >
              <Edit3 className="h-4 w-4" />
              Edit Existing
            </AlertDialogAction>
          )}
          {existingCount !== totalContacts && (
            <AlertDialogAction
              onClick={onContinue}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4" />
              Continue Import
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
