import React, {
  Dispatch,
  FC,
  FormEventHandler,
  KeyboardEventHandler,
  ReactEventHandler,
  SetStateAction,
  useRef,
} from "react";

interface Props {
  isActiveUpdate: boolean;
  editableImage: string;
  setEditableImage: Dispatch<SetStateAction<string>>;
  image?: string;
}

const ImageEditable: FC<Props> = ({
  isActiveUpdate,
  editableImage,
  setEditableImage,
  image,
}) => {
  const inputRef = useRef(null);

  const handleInput: FormEventHandler<HTMLSpanElement> = (event) => {
    const input = event?.currentTarget.textContent!;
    setEditableImage(input);
  };

  const preventNewLine: KeyboardEventHandler<HTMLSpanElement> = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  // Set default invalid placeholder img on failed upload
  const handleInvalidUpload: ReactEventHandler<HTMLImageElement> = (event) => {
    // @ts-ignore
    event.target.src =
      "https://www.shareicon.net/data/2016/08/20/817729_close_395x512.png";
  };

  return (
    <div
      className={`flex items-center w-full h-full ${
        isActiveUpdate && "animate-pulse"
      }`}
    >
      {isActiveUpdate ? (
        <span
          ref={inputRef}
          contentEditable={true}
          placeholder={image ?? "Add an image of your store..."}
          onInput={handleInput}
          spellCheck={false}
          suppressContentEditableWarning={true}
          onKeyDown={preventNewLine}
          className={`py-4 w-full truncate text-5xl md:text-5xl font-Basic text-primary tracking-tighter bg-transparent caret-black min-w-[2rem] pr-3 focus:outline-none empty:before:content-[attr(placeholder)] cursor-default ${
            isActiveUpdate && "cursor-text"
          }`}
        >
          {editableImage === image ?? image}
        </span>
      ) : (
        <img
          src={image}
          className="h-[90%] aspect-square rounded-full object-cover shadow-md"
          onError={handleInvalidUpload}
        />
      )}
    </div>
  );
};

export { ImageEditable };
