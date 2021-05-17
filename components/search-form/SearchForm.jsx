import PropTypes from "prop-types";
import { useState } from "react";
import { useQueryClient } from "react-query";
import useForm from "../../lib/useForm";
import ErrorMessage from "../error-message/ErrorMessage";
import styles from "./search-form.module.css";

export default function SearchForm({ onSearch }) {
  const { inputs, handleChange } = useForm({ searchterm: "" });
  const [errors, setErrors] = useState(null);

  const queryClient = useQueryClient();

  return (
    <>
      <form
        className={`${styles.form} center`}
        onSubmit={(e) => {
          e.preventDefault();
          setErrors(null);
          try {
            if (inputs.searchterm.length === 0) {
              setErrors({ searchterm: ["This is an required field."] });
              return;
            }
            queryClient.setQueryData("searchResults", []);
            // Mutate function from parent component
            onSearch(inputs);
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <fieldset>
          <label htmlFor="searchterm">Searchterm:</label>
          <input
            value={inputs.searchterm}
            onChange={handleChange}
            type="text"
            name="searchterm"
            id="searchterm"
          />
          <ErrorMessage isVisible={errors?.searchterm.length > 0}>
            {errors?.searchterm}
          </ErrorMessage>
          <button type="submit">Search</button>
        </fieldset>
      </form>
    </>
  );
}

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
