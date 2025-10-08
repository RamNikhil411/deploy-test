import { Loader } from "lucide-react";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const DeleteDialog = ({
  isDeleteOpen,
  setDeleteClose,
  children,
  onCancel,
  onConfirm,
  isDeleteLoading,
  type,
}: {
  isDeleteOpen: boolean;
  setDeleteClose: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;

  isDeleteLoading?: boolean;
  type?: "Delete" | "Archive" | "Resend Invite";
}) => {
  return (
    <Dialog open={isDeleteOpen} onOpenChange={setDeleteClose}>
      <DialogContent
        className="sm:max-w-[450px] rounded-2xl gap-2"
        aria-describedby="modal-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="text-[17px] font-normal tracking-wide">
            {type || "Archive"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-[16px] flex flex-col font-normal justify-between">
          <span className="text-sm font-normal py-2 text-gray-500">
            {children}
          </span>
        </DialogDescription>
        <div className="flex justify-end gap-5">
          <Button
            variant="outline"
            onClick={onCancel}
            className="bg-white hover:bg-gray-200 text-black border font-normal px-6 py-1 rounded-md"
          >
            Close
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-lime-600 hover:bg-green-700 text-white font-normal px-6 py-1 rounded-md"
          >
            {isDeleteLoading ? (
              <Loader className="animate-spin" />
            ) : (
              type || "Archive"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
