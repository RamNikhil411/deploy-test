import { FormContext } from "@/context/formContext";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useContext, useState } from "react";
import { createFormAPI } from "../https/services/form";
import { Button } from "../ui/button";

const Forms = () => {
  const router = useRouter();

  const searchParams = new URLSearchParams(location.search);

  const [pagination, setPagination] = useState<{
    page: number | string;
    limit: number | string;
    order_by: string | null;
    order_type: string | null;
  }>({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 25,
    order_by: searchParams.get("order_by") || null,
    order_type: searchParams.get("order_type") || null,
  });

  const { mutate: createForm, isPending } = useMutation({
    mutationKey: ["createForm"],
    mutationFn: async () => {
      const response = await createFormAPI({});
      return response?.data?.data;
    },
    onSuccess: (data: any) => {
      router.navigate({ to: `${data?.id}/form_builder` });
    },
  });

  // const { data: FormsData, isFetching } = useQuery({
  //   queryKey: ["forms", pagination],
  //   queryFn: async () => {
  //     let queryParams = {
  //       page: pagination.page,
  //       limit: pagination.limit,
  //       order_by: pagination.order_by,
  //       order_type: pagination.order_type,
  //     };
  //     router.navigate({
  //       to: "/forms",
  //       search: queryParams,
  //       replace: true,
  //     });
  //     const response = await getAllFormsAPI(queryParams);
  //     return response?.data?.data;
  //   },
  // });

  return (
    <div className="flex h-screen items-center justify-center ">
      <Button disabled={isPending} onClick={() => createForm()}>
        Create Form
      </Button>
    </div>
  );
};

export default Forms;
