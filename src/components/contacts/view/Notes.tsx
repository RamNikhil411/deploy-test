import { getAllNotes } from "@/components/core/ContactQueries";
import { AppToast } from "@/components/core/customToast";
import DeleteDialog from "@/components/core/DeleteDialog";
import {
  addNoteAPI,
  deleteNoteAPI,
  updateNotesByIdAPI,
} from "@/components/https/services/users";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import EditIcon from "@/components/ui/icons/contacts/editIcon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ChevronDown, Loader, Trash2 } from "lucide-react";
import { useState } from "react";

type AddNotePayload = {
  title: string;
  content: string;
  contact_id?: number;
  user_id?: number;
};
const ContactNotes = () => {
  const params = useParams({ strict: false });
  const [addNote, setAddNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [addNoteError, setAddNoteError] = useState({
    title: "",
    content: "",
  });
  const [editingNoteId, setEditingNoteId] = useState<Number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState<Number | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 25 });

  const { isLoadingNotes, allNotes, refetchNotes } = getAllNotes({
    ...(params?.contact_id
      ? { contact_id: Number(params.contact_id) }
      : { user_id: Number(params?.user_id) }),
    page: pagination.page,
    limit: pagination.limit,
  });
  const { mutate: addNoteMutate, isPending: addNotePending } = useMutation({
    mutationKey: ["addNote"],
    mutationFn: async (data: AddNotePayload) => {
      const response = await addNoteAPI(data);
      return response;
    },
    onSuccess: (response) => {
      refetchNotes();
      setAddNote(false);
      handleCancel();
      AppToast.success({ message: response?.data?.message });
    },
    onError: (error: any) => {
      setAddNoteError(error?.data?.err_data);
    },
  });

  const { mutate: updateNoteMutate, isPending: updateNotePending } =
    useMutation({
      mutationKey: ["updateNote"],
      mutationFn: async ({
        id,
        data,
      }: {
        id: Number;
        data: AddNotePayload;
      }) => {
        const response = await updateNotesByIdAPI(id, data);
        return response;
      },
      onSuccess: (response) => {
        refetchNotes();
        setAddNote(false);
        handleCancel();
        AppToast.success({ message: response?.data?.message });
      },
      onError: (error: any) => {
        setAddNoteError(error?.data?.err_data);
      },
    });

  const { mutate: deleteNoteMutate, isPending: deleteNotePending } =
    useMutation({
      mutationKey: ["deleteNote"],
      mutationFn: async (id: Number) => {
        const response = await deleteNoteAPI(id);
        return response;
      },
      onSuccess: (response) => {
        refetchNotes();
        setShowDeleteDialog(false);
        setDeleteNoteId(null);
        AppToast.success({ message: response?.data?.message });
      },
      onError: (error: any) => {
        AppToast.error({ message: error?.data?.message });
      },
    });

  const handleAddNote = () => {
    if (editingNoteId) {
      updateNoteMutate({
        id: editingNoteId,
        data: {
          title: noteTitle,
          content: noteContent,
          ...(params?.contact_id
            ? { contact_id: Number(params.contact_id) }
            : { user_id: Number(params?.user_id) }),
        },
      });
    } else {
      addNoteMutate({
        title: noteTitle,
        content: noteContent,
        ...(params?.contact_id
          ? { contact_id: Number(params.contact_id) }
          : { user_id: Number(params?.user_id) }),
      });
    }
  };
  const handleEditNote = (note) => {
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setAddNote(true);
    setEditingNoteId(note.id);
  };
  const onCancelDeleteContact = () => {
    setShowDeleteDialog(false);
    setDeleteNoteId(null);
  };
  const handleCancel = () => {
    setAddNote(false);
    setEditingNoteId(null);
    setNoteTitle("");
    setNoteContent("");
    setAddNoteError({ title: "", content: "" });
  };

  return (
    <div className="">
      <div className="flex justify-end">
        {addNote ? (
          <Button
            onClick={() => {
              handleCancel();
            }}
            className="mb-4 bg-lime-600 text-white hover:bg-green-700"
          >
            Cancel
          </Button>
        ) : (
          <Button
            onClick={() => {
              setAddNote(true);
            }}
            className="mb-4 bg-lime-600 text-white hover:bg-green-700"
          >
            Add Note
          </Button>
        )}
      </div>
      {addNote && (
        <div
          className="space-y-2"
          onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
        >
          <Input
            className="w-full p-2 border rounded bg-lime-20 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            placeholder="Enter note title"
            value={noteTitle?.charAt(0).toUpperCase() + noteTitle?.slice(1)}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
          {addNoteError && (
            <p className="text-red-500 text-xs">{addNoteError?.title?.[0]}</p>
          )}
          <Textarea
            className="w-full p-2 border rounded resize-none focus-visible:ring-0 focus-visible:outline-none text-sm"
            placeholder="Enter your note here..."
            value={noteContent?.charAt(0).toUpperCase() + noteContent?.slice(1)}
            onChange={(e) => setNoteContent(e.target.value)}
          />
          {addNoteError && (
            <p className="text-red-500 text-xs">{addNoteError?.content?.[0]}</p>
          )}
          <div className="flex justify-end">
            <Button
              onClick={() => {
                handleAddNote();
              }}
              className="mt-2 mb-2 bg-gray-200  hover:bg-gray-200 text-gray-800 rounded"
            >
              {editingNoteId
                ? updateNotePending
                  ? "Updating..."
                  : "Update Note"
                : addNotePending
                  ? "Saving..."
                  : "Save Note"}
            </Button>
          </div>
        </div>
      )}
      <div className=" h-[calc(100vh-314px)]">
        {isLoadingNotes ? (
          <div className="text-center h-[calc(100vh-314px)] flex items-center justify-center">
            <Loader className="w-5 h-5 animate-spin" />
          </div>
        ) : allNotes?.records?.length === 0 && !addNote ? (
          <div className="text-center h-full flex items-center justify-center">
            No notes found
          </div>
        ) : (
          <Accordion type="multiple" className="w-full space-y-2 ">
            {allNotes?.records?.map((note) => (
              <AccordionItem
                key={note.id}
                value={`note-${note.id}`}
                className="rounded-t bg-stone-100"
              >
                <AccordionTrigger className="text-slate-700 items-center  font-normal hover:no-underline !rounded-t !py-2  px-2 [&>svg:last-child]:hidden">
                  <ChevronDown className="h-5 w-5" />
                  <div className="flex w-full items-center justify-between  ">
                    <div className="flex gap-3 items-center">
                      <span className="font-normal text-md">{note.title}</span>
                      <span className="text-xs font-light">
                        {dayjs(note.createdAt).format("MMMM D, YYYY")}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center ">
                      <span
                        onClick={() => handleEditNote(note)}
                        className="cursor-pointer"
                      >
                        <EditIcon className="h-4 w-4" />
                      </span>
                      <span
                        className="cursor-pointer"
                        onClick={() => {
                          setShowDeleteDialog(true);
                          setDeleteNoteId(note.id);
                        }}
                      >
                        <Trash2 className="h-5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="p-2 bg-white border border-t-0 rounded-b">
                  <p className="font-light text-slate-700">{note.content}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      <DeleteDialog
        isDeleteOpen={showDeleteDialog}
        setDeleteClose={onCancelDeleteContact}
        onCancel={onCancelDeleteContact}
        onConfirm={() => deleteNoteId && deleteNoteMutate(deleteNoteId)}
        isDeleteLoading={deleteNotePending}
        type="Delete"
      >
        <div className="space-y-4">
          <div>{`Are you sure you want to delete this note? `}</div>
        </div>
      </DeleteDialog>
    </div>
  );
};
export default ContactNotes;
