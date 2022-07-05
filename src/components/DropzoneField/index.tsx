import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
} from "react";
import { useDropzone } from "react-dropzone";
import { FileWithPreview } from "../../types";

interface Props {
  children: ReactNode;
  setFile: Dispatch<SetStateAction<FileWithPreview | null>>;
}

const DropzoneField: FC<Props> = ({ children, setFile }) => {
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: "image/*",
      multiple: true,
    });

  // Handle successfully updated files
  useEffect(() => {
    if (acceptedFiles.length) {
      const [file]: File[] = acceptedFiles;

      // Clone the item to update fileName
      const newFile: FileWithPreview = new File([file], file.name, {
        type: file.type,
      });

      // Create preview
      newFile["preview"] = URL.createObjectURL(file);

      setFile(newFile);

      // Revoke the data uris to avoid memory leaks
      return () => {
        if (newFile) URL.revokeObjectURL(newFile.preview!);
      };
    }
  }, [acceptedFiles]);

  // Debug rejection errors
  useEffect(() => {
    if (fileRejections.length) {
      const [file] = fileRejections;
      console.log(file.errors);
    }
  }, [fileRejections]);

  return (
    <div className="flex flex-row w-full" {...getRootProps()}>
      {children}
      <input {...getInputProps()} />
    </div>
  );
};

export { DropzoneField };
