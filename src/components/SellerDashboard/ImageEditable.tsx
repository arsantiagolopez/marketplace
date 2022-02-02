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
  const handleInvalidUpload: ReactEventHandler<HTMLImageElement> | undefined = (
    event
  ) => {
    // @ts-ignore
    event.target.src =
      "https://www.shareicon.net/data/2016/08/20/817729_close_395x512.png";
  };

  return (
    <div
      className={`flex flex-row items-baseline w-full h-full ${
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
          className="self-center text-5xl md:text-5xl font-Basic text-primary tracking-tighter bg-transparent caret-black w-full py-0 focus:outline-none truncate empty:before:content-[attr(placeholder)] cursor-text"
        >
          {editableImage === image ?? image}
        </span>
      ) : (
        <img
          src={image}
          className="h-full aspect-square rounded-full object-cover shadow-md"
          onError={handleInvalidUpload}
        />
      )}
    </div>
  );
};

export { ImageEditable };
