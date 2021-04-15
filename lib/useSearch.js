import { useMutation } from "react-query";
import { publicFetch } from "./fetch";

export function useSearch() {
  return useMutation((inputs) => publicFetch.post("/search", inputs));
}
