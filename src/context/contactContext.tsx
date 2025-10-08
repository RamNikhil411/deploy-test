import { SearchParams } from "@/lib/interfaces/contacts";
import { useSearch } from "@tanstack/react-router";
import { createContext, useState } from "react";

interface contactContext {
  activeOrganization: number | null;
  setActiveOrganization: React.Dispatch<React.SetStateAction<number | null>>;
}

export const ContactContext = createContext<contactContext>({
  activeOrganization: null,
  setActiveOrganization: () => {},
});

const CreateContactContext = ({ children }: { children: React.ReactNode }) => {
  const searchParams: SearchParams = useSearch({ strict: false });
  const [activeOrganization, setActiveOrganization] = useState<number | null>(
    searchParams.organization_id || null
  );
  
  return (
    <ContactContext.Provider
      value={{ activeOrganization, setActiveOrganization }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export default CreateContactContext;
