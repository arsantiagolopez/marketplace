import axios from "axios";
import React, {
  FC,
  FormEventHandler,
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
  description?: string;
  listing?: ListingEntity;
  mutate: KeyedMutator<ListingEntity>;
}

const DescriptionEditable: FC<Props> = ({ description, listing, mutate }) => {
  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const [editableDescription, setEditableDescription] = useState<string>(
    description || ""
  );

  const inputRef = useRef(null);

  const dataHasChanged = editableDescription !== "";

  const toggleEditActive = () => setIsEditActive(!isEditActive);

  const handleInput: FormEventHandler<HTMLSpanElement> = (event) => {
    const input = event?.currentTarget.textContent!;
    setEditableDescription(input);
  };

  const handleCancel = () => {
    setIsEditActive(false);
    setEditableDescription("");
  };

  // Update seller profile
  const handleSave = async (): Promise<void> => {
    const description = editableDescription ? editableDescription : undefined;

    const { data, status } = await axios.put(`/api/listings/${listing?.id}`, {
      description,
    });

    if (status !== 200) {
      return console.log("Something went awfully wrong. Try again later.");
    }

    // @ts-ignore
    mutate({ ...listing, description: editableDescription });

    // Reset state fields
    setEditableDescription("");
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
      className={`flex flex-row flex-wrap w-full py-3 md:py-4 text-tertiary ${
        isEditActive && "animate-pulse"
      }`}
    >
      {isEditActive ? (
        <span
          ref={inputRef}
          contentEditable={true}
          placeholder={description}
          onInput={handleInput}
          spellCheck={false}
          suppressContentEditableWarning={true}
          className={`flex flex-row flex-wrap self-center bg-transparent w-auto min-w-[2rem] py-0 pr-3 focus:outline-none empty:before:content-[attr(placeholder)] cursor-default ${
            isEditActive && "cursor-text"
          }`}
        >
          {editableDescription === description ?? description}
        </span>
      ) : !description ? (
        <div className="flex flex-col w-11/12 h-full animate-pulse">
          <div className="h-8 w-full bg-gray-100 mb-3 rounded-sm shadow-md"></div>
          <div className="h-8 w-full bg-gray-100 mb-3 rounded-sm shadow-md"></div>
          <div className="h-8 w-8/12 bg-gray-100 mb-3 rounded-sm shadow-md"></div>
        </div>
      ) : (
        <p className="text-tertiary">{description}</p>
      )}

      {isEditActive ? (
        <div className="flex flex-row items-center self-end">
          <IoCloseSharp
            onClick={handleCancel}
            className="text-gray-300 text-2xl cursor-pointer hover:text-secondary"
          />
          {dataHasChanged && (
            <GoCheck
              onClick={handleSave}
              className="text-gray-300 text-xl ml-2 cursor-pointer hover:text-secondary"
            />
          )}
        </div>
      ) : (
        <MdEdit
          onClick={toggleEditActive}
          className="mt-auto text-gray-300 text-2xl ml-4 cursor-pointer hover:text-secondary"
        />
      )}
    </div>
  );
};

export { DescriptionEditable };
