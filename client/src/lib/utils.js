import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import stc from "string-to-color";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const stringToColor = (str) => {
  return stc(str);
};
