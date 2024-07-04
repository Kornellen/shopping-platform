import { format } from "date-fns";

export function formatDate(dateToFormat) {
  const date = new Date(dateToFormat);

  return format(date, "dd.MM.yyyy");
}
