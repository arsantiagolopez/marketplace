import { Popover } from "@headlessui/react";
import React, {
  FC,
  MouseEventHandler,
  ReactNode,
  useRef,
  useState,
} from "react";

interface Props {
  children: ReactNode;
  label: string;
  position?: string;
  fitWidth?: boolean;
}

const Tooltip: FC<Props> = ({ children, label, position, fitWidth }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const wrapperRef = useRef();

  const handleEnter = () => setIsOpen(true);

  // Prevent ref's children from clearing hovered state
  const handleLeave: MouseEventHandler<HTMLDivElement> = (event) => {
    const { relatedTarget: hoveredNode } = event;
    //@ts-ignore
    const hoveredNodeInsideRef = wrapperRef?.current?.contains(hoveredNode);
    if (!hoveredNodeInsideRef) {
      setIsOpen(false);
    }
  };

  return (
    <Popover
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="flex justify-center"
    >
      <Popover.Button className="relative">
        {children}
        {isOpen && (
          <Popover.Panel
            static
            className={`z-50 absolute max-w-[50vw] text-ellipsis text-left flex items-center justify-center bg-primary text-white text-xs rounded-sm py-1 px-2 md:py-2 md:px-3 cursor-pointer ${
              !position
                ? "left-full"
                : position === "left"
                ? "right-full"
                : position === "right"
                ? "left-full"
                : position === "center"
                ? "left-[50%] top-[75%]"
                : null
            } ${!fitWidth ? "w-44" : "w-fit truncate"}`}
          >
            {label}
          </Popover.Panel>
        )}
      </Popover.Button>
    </Popover>
  );
};

export { Tooltip };
