import axios from "axios";
import { useMutation } from "react-query";

export function useSearch() {
  return useMutation(async (inputs) => {
    const GOOGLE_API_KEY = "AIzaSyCFeW4BlRQbtaBiKnNDaKl-YpjOcrI6NmU";
    const url = `https://www.googleapis.com/books/v1/volumes?q=${inputs.title}&key=${GOOGLE_API_KEY}`;

    const res = await axios.get(url, inputs);
    return res;
  });
}
