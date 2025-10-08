import React, { useContext, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import FormField from "./FormField";
import { basicFields } from "@/lib/constants/formFieldConstants";
import { FormContext } from "@/context/formContext";

interface FieldPaletteProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

const FieldPalette = ({ title, setTitle }: FieldPaletteProps) => {
  const { layout, setLayout } = useContext(FormContext);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredFields = (fields: any[]) => {
    return fields.filter((field) =>
      field.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="overflow-auto border-r  scrollbar-hide h-full">
      <div className="space-y-4 p-4  ">
        <div>
          <Input
            placeholder="Form Title"
            className="border-none lg:text-lg !focus-visible:border-none focus-visible:ring-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          <h1>Layout Options</h1>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => setLayout("row")}
              className={`border bg-transparent ${layout === "row" ? "bg-lime-600 hover:bg-green-700 text-white" : "hover:bg-transparent text-slate-700 "}   font-normal px-4 py-2 rounded-md`}
            >
              Row
            </Button>
            <Button
              onClick={() => setLayout("column")}
              className={`border bg-transparent ${layout === "column" ? "bg-lime-600 hover:bg-green-700 text-white" : "hover:bg-transparent text-slate-700 "}  font-normal px-4 py-2 rounded-md`}
            >
              Column
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <h1>Form Elements</h1>
          <div className="relative">
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border pl-9 !focus-visible:border-none focus-visible:ring-0"
            />
            <Search className="absolute left-2 stroke-muted-foreground size-5 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-slate-700 font-normal hover:no-underline">
                Basic
              </AccordionTrigger>
              <AccordionContent className="">
                <div className="grid grid-cols-2 gap-4">
                  {filteredFields(basicFields)?.map((field) => (
                    <FormField key={field.label} field={field} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FieldPalette;
