import PropTypes from "prop-types";
import { useState } from "react";
import useForm from "../../lib/useForm";
import ErrorMessage from "../error-message/ErrorMessage";
import styles from "./search-form.module.css";

export default function SearchForm({ handleSubmit }) {
  const { inputs, handleChange } = useForm({ title: "" });
  const [errors, setErrors] = useState(null);

  return (
    <>
      <form
        className={`${styles.form} center`}
        onSubmit={(e) => {
          e.preventDefault();
          setErrors(null);
          try {
            if (inputs.title.length === 0) {
              setErrors({ title: ["This is an required field."] });
              return;
            }
            // Mutate function from parent component
            handleSubmit(inputs);
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <fieldset>
          <label className="semi-bold" htmlFor="title">
            Title
          </label>
          <input
            value={inputs.title}
            onChange={handleChange}
            type="text"
            name="title"
            id="title"
          />
          <ErrorMessage isVisible={errors?.title.length > 0}>
            {errors?.title}
          </ErrorMessage>
          <button type="submit">Search</button>
        </fieldset>
      </form>
    </>
  );
}

SearchForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};
