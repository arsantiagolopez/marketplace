import axios from "axios";
import React, {
  FC,
  FormEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { GoCheck } from "react-icons/go";
import { IoCloseSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { KeyedMutator } from "swr";
import { ListingEntity } from "../../../types";

interface Props {
  name?: string;
  listing?: ListingEntity;
  mutate: KeyedMutator<ListingEntity>;
}

const NameEditable: FC<Props> = ({ name, listing, mutate }) => {
  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const [editableName, setEditableName] = useState<string>(name || "");

  const inputRef = useRef(null);

  const dataHasChanged = editableName !== "";

  const toggleEditActive = () => setIsEditActive(!isEditActive);

  const handleInput: FormEventHandler<HTMLSpanElement> = (event) => {
    const input = event?.currentTarget.textContent!;
    setEditableName(input);
  };

  const preventNewLine: KeyboardEventHandler<HTMLSpanElement> = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleCancel = () => {
    setIsEditActive(false);
    setEditableName("");
  };

  // Update seller profile
  const handleSave = async (): Promise<void> => {
    const name = editableName ? editableName : undefined;

    const { data, status } = await axios.put(`/api/listings/${listing?.id}`, {
      name,
    });

    if (status !== 200) {
      return console.log("Something went awfully wrong. Try again later.");
    }

    // @ts-ignore
    mutate({ ...listing, name: editableName });

    // Reset state fields
    setEditableName("");
    setIsEditActive(false);
  };

  // Set focus to store name editable
  useEffect(() => {
    if (isEditActive) {
      if (inputRef.current) {
        // @ts-ignore
        inputRef.current.focus();
      }
    }
  }, [isEditActive]);

  return (
    <div
      className={`flex flex-row w-fit py-2 font-Basic text-4xl md:text-6xl tracking-tighter my-3 md:my-4 max-w-full truncate ${
        isEditActive && "animate-pulse"
      }`}
    >
      {isEditActive ? (
        <span
          ref={inputRef}
          contentEditable={true}
          placeholder={name}
          onInput={handleInput}
          spellCheck={false}
          suppressContentEditableWarning={true}
          onKeyDown={preventNewLine}
          className={`flex flex-row justify-start max-w-full truncate self-center bg-transparent w-auto min-w-[2rem] py-0 pr-3 focus:outline-none empty:before:content-[attr(placeholder)] cursor-default ${
            isEditActive && "cursor-text"
          }`}
        >
          {editableName === name ?? name}
        </span>
      ) : !name ? (
        <div className="h-12 w-56 bg-slate-100 rounded animate-pulse shadow-md"></div>
      ) : (
        <h1 className="text-primary">{name}</h1>
      )}

      {isEditActive ? (
        <div className="flex flex-row items-center self-end">
          <IoCloseSharp
            onClick={handleCancel}
            className="text-gray-200 text-3xl cursor-pointer hover:text-secondary"
          />
          {dataHasChanged && (
            <GoCheck
              onClick={handleSave}
              className="text-gray-300 text-2xl ml-2 cursor-pointer hover:text-secondary"
            />
          )}
        </div>
      ) : (
        <MdEdit
          onClick={toggleEditActive}
          className="mt-auto mb-1 text-gray-300 text-2xl ml-4 cursor-pointer hover:text-secondary"
        />
      )}
    </div>
  );
};

export { NameEditable };
