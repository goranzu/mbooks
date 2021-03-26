import useForm from "../lib/useForm";
import axios from "axios";

export default function SearchPage() {
  const { inputs, handleChange } = useForm({ title: "" });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const data = await axios.post("/api/search", inputs);
          console.log(data.data);
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <fieldset>
        <label htmlFor="title">
          Title
          <input
            value={inputs.title}
            onChange={handleChange}
            type="text"
            name="title"
            id="title"
          />
        </label>
        <button type="submit">Search</button>
      </fieldset>
    </form>
  );
}
