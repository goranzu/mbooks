import axios from "axios";
import { useMutation } from "react-query";

export function useSearch() {
  return useMutation(async (inputs) => {
    const KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${inputs.searchterm}&projection=lite&key=${KEY}`;

    const res = await axios.get(url);
    return res;
  });
}
