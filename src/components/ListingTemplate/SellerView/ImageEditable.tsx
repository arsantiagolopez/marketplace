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
  image?: string;
  listing?: ListingEntity;
  mutate: KeyedMutator<ListingEntity>;
}

const ImageEditable: FC<Props> = ({
  // isActiveUpdate,
  // editableImage,
  // setEditableImage,
  image,
  listing,
  mutate,
}) => {
  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const [editableImage, setEditableImage] = useState<string>(image || "");

  const inputRef = useRef(null);

  const dataHasChanged = editableImage !== "";

  const toggleEditActive = () => setIsEditActive(!isEditActive);

  const handleInput: FormEventHandler<HTMLSpanElement> = (event) => {
    const input = event?.currentTarget.textContent!;
    setEditableImage(input);
  };

  const preventNewLine: KeyboardEventHandler<HTMLSpanElement> = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleCancel = () => {
    setIsEditActive(false);
    setEditableImage("");
  };

  // Update seller profile
  const handleSave = async (): Promise<void> => {
    const image = editableImage ? editableImage : undefined;

    const { status } = await axios.put(`/api/listings/${listing?.id}`, {
      image,
    });

    if (status !== 200) {
      return console.log("Something went awfully wrong. Try again later.");
    }

    // @ts-ignore
    mutate({ ...listing, image: editableImage });

    // Reset state fields
    setEditableImage("");
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
      className={`absolute bottom-0 right-0 w-full px-6 md:px-8 flex flex-row justify-start py-2 truncate font-Basic text-gray-300 text-4xl md:text-6xl tracking-tighter my-3 md:my-4 ${
        isEditActive ? "animate-pulse justify-start" : "justify-end"
      }`}
    >
      {isEditActive && (
        <span
          ref={inputRef}
          contentEditable={true}
          placeholder={image}
          onInput={handleInput}
          spellCheck={false}
          suppressContentEditableWarning={true}
          onKeyDown={preventNewLine}
          className={`flex flex-row justify-start self-center bg-transparent min-w-[2rem] max-w-full truncate py-2 pr-4 focus:outline-none empty:before:content-[attr(placeholder)] cursor-default ${
            isEditActive && "cursor-text"
          } ${isEditActive && dataHasChanged ? "w-[85%]" : "w-[90%]"}`}
        >
          {editableImage === image ?? image}
        </span>
      )}

      {isEditActive ? (
        <div className="absolute right-6 bottom-2 flex flex-row items-center self-end py-2 md:pr-2">
          <IoCloseSharp
            onClick={handleCancel}
            className="text-gray-300 text-3xl md:text-5xl cursor-pointer hover:text-primary"
          />
          {dataHasChanged && (
            <GoCheck
              onClick={handleSave}
              className="text-gray-300 text-2xl md:text-4xl cursor-pointer hover:text-primary"
            />
          )}
        </div>
      ) : (
        <MdEdit
          onClick={toggleEditActive}
          className="mt-auto mb-2 text-gray-300 text-4xl md:text-5xl cursor-pointer hover:text-primary hover:animate-pulse"
        />
      )}
    </div>
  );
};

export { ImageEditable };
