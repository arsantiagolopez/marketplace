import React, {
  Dispatch,
  FC,
  FormEventHandler,
  KeyboardEventHandler,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { GoCheck } from "react-icons/go";
import { IoCloseSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

interface Props {
  isActiveUpdate: boolean;
  setIsActiveUpdate: Dispatch<SetStateAction<boolean>>;
  editableStoreName: string;
  setEditableStoreName: Dispatch<SetStateAction<string>>;
  handleCancel: () => void;
  handleSave: () => void;
  store?: string;
  dataHasChanged: boolean;
}

const StoreNameEditable: FC<Props> = ({
  isActiveUpdate,
  setIsActiveUpdate,
  editableStoreName,
  setEditableStoreName,
  handleCancel,
  handleSave,
  store,
  dataHasChanged,
}) => {
  const inputRef = useRef(null);

  const handleProfileUpdate = () => setIsActiveUpdate(!isActiveUpdate);

  const handleInput: FormEventHandler<HTMLSpanElement> = (event) => {
    const input = event?.currentTarget.textContent!;
    setEditableStoreName(input);
  };

  const preventNewLine: KeyboardEventHandler<HTMLSpanElement> = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  // Set focus to store name editable
  useEffect(() => {
    if (isActiveUpdate) {
      if (inputRef.current) {
        // @ts-ignore
        inputRef.current.focus();
      }
    }
  }, [isActiveUpdate]);

  return (
    <div
      className={`flex flex-row w-full py-2 truncate ${
        isActiveUpdate && "animate-pulse"
      }`}
    >
      {isActiveUpdate ? (
        <span
          ref={inputRef}
          contentEditable={true}
          placeholder={store}
          onInput={handleInput}
          spellCheck={false}
          suppressContentEditableWarning={true}
          onKeyDown={preventNewLine}
          className={`self-center text-5xl md:text-5xl font-Basic text-primary tracking-tighter bg-transparent caret-black w-auto min-w-[2rem] py-0 pr-3 focus:outline-none empty:before:content-[attr(placeholder)] cursor-default ${
            isActiveUpdate && "cursor-text"
          }`}
        >
          {editableStoreName === store ?? store}
        </span>
      ) : !store ? (
        <div className="h-12 w-56 bg-slate-300 rounded animate-pulse"></div>
      ) : (
        <h1 className="text-5xl md:text-5xl font-Basic text-primary tracking-tighter">
          {store}
        </h1>
      )}

      {isActiveUpdate ? (
        <div className="flex flex-row items-center self-end">
          <IoCloseSharp
            onClick={handleCancel}
            className="text-gray-300 text-3xl cursor-pointer hover:text-secondary"
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
          onClick={handleProfileUpdate}
          className="mt-auto mb-1 text-gray-300 text-2xl ml-4 cursor-pointer hover:text-secondary"
        />
      )}
    </div>
  );
};

export { StoreNameEditable };
