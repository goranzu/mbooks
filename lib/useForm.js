import { useState } from "react";

export default function useForm(initialState = {}) {
  const [inputs, setInputs] = useState(initialState);

  function handleChange(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  function clearForm() {
    setInputs(
      Object.entries(inputs).reduce((acc, [key]) => {
        acc[key] = "";
        return acc;
      }, {}),
    );
  }

  return { inputs, handleChange, clearForm };
}
