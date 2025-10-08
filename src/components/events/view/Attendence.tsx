import TanStackTable from "@/components/core/TanstackTable";
import AttendanceColumns from "./AttendanceColumns";

export default function Attendance() {
  const columns = AttendanceColumns();
  // Dummy data for organizations
  const organizations = {
    records: [
      {
        name: "Org 1",
        email: "org1@example.com",
        phone: "6912616126",
        role: "donor",
        organization: "1",
        status: "attended",
        check_in: "10:00 AM",
        check_out: "11:00 AM",
        duration: "1h",
      },
      {
        name: "Org 2",
        email: "org2@example.com",
        phone: "7412616126",
        role: "volunteer",
        organization: "2",
        status: "missed",
        check_in: null,
        check_out: null,
        duration: null,
      },
      {
        name: "Org 3",
        email: "org3@example.com",
        phone: "7912616126",
        role: "member",
        organization: "3",
        status: "attended",
        check_in: "09:00 AM",
        check_out: "11:00 AM",
        duration: "2h",
      },
      {
        name: "Org 4",
        email: "org4@example.com",
        phone: "9012616126",
        role: "donor",
        organization: "4",
        status: "missed",
        check_in: null,
        check_out: null,
        duration: null,
      },
      {
        name: "Org 5",
        email: "org5@example.com",
        phone: "7112616126",
        role: "volunteer",
        organization: "5",
        status: "attended",
        check_in: "09:00 AM",
        check_out: "11:00 AM",
        duration: "2h",
      },
      {
        name: "Org 6",
        email: "org6@example.com",
        phone: "6012616126",
        role: "member",
        organization: "6",
        status: "missed",
        check_in: null,
        check_out: null,
        duration: null,
      },
      {
        name: "Org 7",
        email: "org7@example.com",
        phone: "7012616126",
        role: "donor",
        organization: "7",
        status: "attended",
        check_in: "09:00 AM",
        check_out: "11:00 AM",
        duration: "2h",
      },
      {
        name: "Org 8",
        email: "org8@example.com",
        phone: "8012616126",
        role: "member",
        organization: "8",
        status: "missed",
        check_in: null,
        check_out: null,
        duration: null,
      },
      {
        name: "Org 9",
        email: "org9@example.com",
        phone: "9112616126",
        role: "volunteer",
        organization: "9",
        status: "attended",
        check_in: "09:00 AM",
        check_out: "11:00 AM",
        duration: "2h",
      },
      {
        name: "Org 10",
        email: "org10@example.com",
        phone: "9012616126",
        role: "donor",
        organization: "10",
        status: "missed",
        check_in: null,
        check_out: null,
        duration: null,
      },
      {
        name: "Org 11",
        email: "org11@example.com",
        phone: "9712616127",
        role: "volunteer",
        organization: "11",
        status: "attended",
        check_in: "09:00 AM",
        check_out: "11:00 AM",
        duration: "2h",
      },
      {
        name: "Org 12",
        email: "org12@example.com",
        phone: "8121619127",
        role: "member",
        organization: "12",
        status: "missed",
        check_in: null,
        check_out: null,
        duration: null,
      },
      {
        name: "Org 13",
        email: "org13@example.com",
        phone: "990894610",
        role: "donor",
        organization: "13",
        status: "attended",
        check_in: "09:00 AM",
        check_out: "11:00 AM",
        duration: "2h",
      },
    ],
    pagination_info: {
      page: 1,
      page_size: 10,
      total_pages: 2,
      total_records: 13,
      current_page: 1,
    },
  };

  const getData = async ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }) => {};
  return (
    <div className="flex flex-col gap-4">
      <TanStackTable
        data={organizations?.records}
        columns={columns}
        paginationDetails={organizations?.pagination_info}
        heightClass="h-[calc(100vh-335px)]"
        getData={getData}
        noDataLabel="Attendance not found"
        removeSortingForColumnIds={[
          "email",
          "name",
          "phone",
          "role",
          "check_in",
          "check_out",
          "duration",
          "status",
        ]}
      />
    </div>
  );
}
