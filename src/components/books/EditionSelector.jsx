function EditionSelector({ editions, selectedEditionKey, onChange, isHindi = false }) {
  return (
    <fieldset className="edition-selector">
      <legend className="edition-selector__legend">{isHindi ? "उपलब्ध संस्करण" : "Available Editions"}</legend>

      <div className="edition-selector__list">
        {editions.map(([key, edition]) => (
          <label
            key={key}
            className={`edition-selector__option ${
              selectedEditionKey === key ? "edition-selector__option--active" : ""
            } ${edition.available ? "" : "edition-selector__option--disabled"}`.trim()}
          >
            <input
              type="radio"
              name="book-edition"
              value={key}
              checked={selectedEditionKey === key}
              onChange={() => onChange(key)}
              disabled={!edition.available}
            />
            <span className="edition-selector__label">{edition.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default EditionSelector;