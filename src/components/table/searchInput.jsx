import { Input } from "../ui/input";

export default function SearchInput({
  placeholder = "Search...",
  onSearch,
  value,
}) {
  return (
    <Input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={onSearch}
      className="w-60"
    />
  );
}
