import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthYearSelectProps {
  month: Date;
  setMonth: (month: Date) => void;
  yearRange?: number;
}

export default function MonthYearSelect({
  month,
  setMonth,
  yearRange = 10,
}: MonthYearSelectProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: yearRange },
    (_, i) => currentYear - Math.floor(yearRange / 2) + i
  );

  return (
    <div className="flex gap-2 items-center">
      <Select
        value={month.getMonth().toString()}
        onValueChange={(value) =>
          setMonth(new Date(month.getFullYear(), Number(value)))
        }
      >
        <SelectTrigger className="w-32 h-fit py-1 data-[size=default]:h-fit">
          <SelectValue placeholder="Month" className="text-sm" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }).map((_, i) => (
            <SelectItem key={i} value={i.toString()}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={month.getFullYear().toString()}
        onValueChange={(value) =>
          setMonth(new Date(Number(value), month.getMonth()))
        }
      >
        <SelectTrigger className="w-24 text-sm data-[size=default]:h-fit py-1">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
