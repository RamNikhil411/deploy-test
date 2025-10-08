import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCancel: () => void;
}

export default function CancelDialog({ open, setOpen, onCancel }: Props) {
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-medium">
              Cancel Import?
            </AlertDialogTitle>
            <AlertDialogDescription className="border bg-gray-50 text-sm p-2 rounded text-gray-800">
              If you cancel now, your uploaded contacts will not be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className=" hover:bg-gray-200 border bg-gray-100 border-gray-100 shadow-none">
              Keep Edit
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-lime-600 hover:bg-lime-700 text-white hover:text-white"
              onClick={onCancel}
            >
              Cancel Upload
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
