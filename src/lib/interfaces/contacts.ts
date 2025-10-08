export interface Organization {
  id: number;
  name: string;
  slug: string;
  region_id: number;
  logo: string | null;
  status: string;
  created_by: CreatedBy;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
  region: Region;
  tags: Tags[];
  user: CreatedBy;
}

export interface CreatedBy {
  id: number;
  email: string;
  full_name: string;
  avatar: null;
}

export interface Region {
  id: number;
  name: string;
}

export interface Tags {
  id: number;
  name: string;
  slug: string;
}

export interface OrganizationProfileProps {
  organization: Organization;
}

export interface AddUser {
  user_id: number;
  roles: number[];
}

export interface AvailableUsers {
  id: number;
  email: string;
  full_name: string;
  phone_number: string | null;
  avatar: string | null;
}

export interface InviteUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  availableUsers: AvailableUsers[];
  handleSendInvite: (data: any) => void;
  isLoading?: boolean;
  isPending?: boolean;
}

export interface Role {
  id: number;
  name: string;
}

export interface RolesDropdownProps {
  roles: Role[];
  selectedRoles: number[];
  onchange: (roles: number[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface pagination {
  page: number;
  limit: number;
  order_by?: string | null;
  order_type?: string | null;
  organization_id?: number | null;
}

export interface SearchParams extends pagination {
  search_string?: string;
  organization_id?: number;
  code?: string;
  token?: string;
  region_id?: number;
}
