import "./styles.scss";

type radioGroupProps = {
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  name: string;
  value: string | { [key: string]: string };
  error?: string | { [key: string]: string };
  options: { label: string; value: string }[];
  onChange?: (name: string, value: string) => void;
  direction?: "row" | "column";
};

function RadioGroup({
  label,
  isRequired,
  name,
  value,
  error,
  options = [],
  direction = "column",
  onChange = () => null,
}: radioGroupProps) {
  const inputValue = typeof value === "string" ? value : value?.[name] || "";
  const inputError = typeof error === "string" ? error : error?.[name] || "";
  return (
    <div className="input-container radio-group">
      {label && (
        <label>
          {label} {isRequired && <span>*</span>}
        </label>
      )}

      <div className={`radio-group__options-container`} style={{ flexDirection: direction }}>
        {options?.map((item, index) => (
          <div
            key={index}
            className="radio-group__option"
            onClick={() => onChange(name, item?.value)}
          >
            <input type="radio" checked={inputValue === item?.value} onChange={() => null} />
            <p>{item.label}</p>
          </div>
        ))}
      </div>

      <div className="input-error">
        {inputError === "required" ? `${label} is required` : inputError}
      </div>
    </div>
  );
}

export default RadioGroup;
