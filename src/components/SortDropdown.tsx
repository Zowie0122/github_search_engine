import React, { useMemo, useState } from "react";

export type SortOption = {
  label: string;
  onClick: () => void;
};

type Props = {
  options: SortOption[];
  defaultOption?: string;
  className?: string;
};

const SortDropdown: React.FC<Props> = ({
  options,
  defaultOption,
  className,
}) => {
  if (!options?.length) return null;

  const initialLabel = useMemo(() => {
    const labels = options.map((o) => o.label);
    return defaultOption && labels.includes(defaultOption)
      ? defaultOption
      : options[0].label;
  }, [options, defaultOption]);

  const [value, setValue] = useState(initialLabel);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const label = e.target.value;
    setValue(label);
    options.find((o) => o.label === label)?.onClick?.();
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`dropdown-primary ${className}`}
    >
      {options.map((o) => (
        <option key={o.label} value={o.label}>
          {`Sorted by ${o.label}`}
        </option>
      ))}
    </select>
  );
};

export default SortDropdown;
