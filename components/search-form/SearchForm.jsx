import PropTypes from "prop-types";
import useForm from "../../lib/useForm";
import styles from "./search-form.module.css";

export default function SearchForm({ handleSubmit }) {
  const { inputs, handleChange } = useForm({ title: "enders game" });

  return (
    <>
      <form
        className={`${styles.form} center`}
        onSubmit={(e) => {
          e.preventDefault();
          try {
            if (!inputs.title) return;
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
          <button type="submit">Search</button>
        </fieldset>
      </form>
    </>
  );
}

SearchForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};
