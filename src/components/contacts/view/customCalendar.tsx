"use client";

import React, { useState } from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { DropdownProps } from "react-day-picker";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";

export function CustomSelectDropdown(props: DropdownProps) {
  const { options, value, onChange, name } = props;

  const handleValueChange = (newValue: string) => {
    if (onChange) {
      onChange({
        target: {
          value: Number(newValue),
          name,
        },
      } as unknown as React.ChangeEvent<HTMLSelectElement>);
    }
  };

  return (
    <Select value={value?.toString()} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[120px] text-sm  h-fit py-1 z-[999]">
        <SelectValue>
          {options?.find((o) => o.value.toString() === value?.toString())
            ?.label || "Select"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="h-[40vh]">
        <SelectGroup>
          {options?.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value.toString()}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function CustomCalendar({
  selectedDate,
  setSelectedDate,
  appointments,
}: {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  appointments: any;
}) {
  const appointmentDate = appointments.map((a: any) => dayjs(a.date).toDate());

  return (
    <>
      <Calendar
        captionLayout="dropdown"
        components={{ Dropdown: CustomSelectDropdown }}
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md w-full "
        classNames={{
          day: "w-10 h-10 p-0 data-[selected-single=true]:bg-lime-600 ",
          week: "flex w-full mt-2 justify-between",
          weekdays: "flex w-full justify-between",
          weekday: "w-10 h-10 font-medium text-md ",
          today: "bg-lime-600 text-white rounded-md",
          button_previous: "border px-1 py-1 rounded",
          button_next: "border px-1 py-1 rounded",
        }}
        modifiers={{ appointments: appointmentDate }}
        modifiersClassNames={{
          appointments: "border rounded-md",
        }}
      />
    </>
  );
}
