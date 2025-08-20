import { useState,FC } from "react";
import { Typography } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { LuCalendar } from "react-icons/lu";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import "./styles.scss";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type props = {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  label?: string;
   isRequired?: boolean;
};

const DatePicker :FC<props>= ({
  label,
  value,
  onChange,
  isRequired,
  errorText = "",
  placeholder="",
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectDate = (day: Date) => {
    setSelectedDate(day);
    setIsOpen(false);
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days.map((d, i) => {
      const inMonth = isSameMonth(d, monthStart);
      const isSelected = selectedDate && isSameDay(d, selectedDate);
      return (
       
        <div
          key={i}
          className={`day ${inMonth ? "" : "outside"} ${isSelected ? "selected" : ""}`}
          onClick={() => handleSelectDate(d)}
        >
          {format(d, "dd")}
        </div>
        
      );
    });
  };

  return (
    <div className="datepicker">
         {label && (
      <Typography fontSize={13}  sx={{ fontFamily: "var(--font-primary)" }}>
        {label}
        {isRequired && <span className="required">*</span>}
      </Typography>
    )}
      <div className="date-input" onClick={() => setIsOpen(!isOpen)}>
        {selectedDate ? format(selectedDate, "MM/dd/yyyy") : "Select Date"}
        <LuCalendar />
      </div>

      {isOpen && (
        <div className="calendar-container">
          <div className="calendar-header">
            <IoIosArrowBack className="calender-leftarrow"color="#000000" size={1} onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} />
            <span>{format(currentMonth, "MMMM dd, yyyy")}</span>
            <IoIosArrowDroprightCircle style={{cursor:"pointer"}} color="#0d488b" size={30} onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}/>
          </div>

          <div className="calendar-grid">
            {daysOfWeek.map((d) => (
              <div key={d} className="weekday">{d}</div>
            ))}
            {renderDays()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;

