import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { IoCloseSharp, IoSearchSharp } from "react-icons/io5";
import { TypeSelect } from "./TypeSelect";

interface Props {
  query: string | null;
  setQuery: Dispatch<SetStateAction<string | null>>;
}

const SearchBar: FC<Props> = ({ query, setQuery }) => {
  const [selected, setSelected] = useState<string>("seller");

  const inputRef = useRef(null);

  const options: string[] = ["seller", "items"];

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) =>
    setQuery(event.target.value);

  const handleClearQuery = () => setQuery("");

  const handleSelect = (option: string) => {
    setSelected(option);
    setQuery("");
    if (inputRef.current) {
      // @ts-ignore
      inputRef.current.focus();
    }
  };

  const typeSelectProps = { options, selected, handleSelect };

  return (
    <div className="relative z-40 flex flex-row items-center h-16 md:h-20 w-full md:w-5/12 rounded-lg shadow-xl bg-white">
      <div className="relative flex flex-row items-center w-full h-full">
        <IoSearchSharp className="absolute text-gray-300 text-2xl md:text-3xl left-4 md:left-5 pointer-events-none" />
        <input
          ref={inputRef}
          spellCheck={false}
          value={query ?? ""}
          onChange={handleInputChange}
          placeholder="Search..."
          className="w-full md:ml-4 pl-12 md:pl-12 py-1 md:py-2 my-2 md:my-1 font-Basic text-primary text-2xl placeholder:text-gray-300 focus:outline-none"
        />
        {query && (
          <IoCloseSharp
            onClick={handleClearQuery}
            className="text-[2.5rem] p-2 cursor-pointer text-gray-300 hover:text-primary transition-all"
          />
        )}
      </div>
      <TypeSelect {...typeSelectProps} />
    </div>
  );
};

export { SearchBar };
