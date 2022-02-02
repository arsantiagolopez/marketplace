import React, { FC } from "react";
import { CgCheck } from "react-icons/cg";
import { RiLoader4Line } from "react-icons/ri";

interface ICheckIcon {
  CustomCheck?: JSX.Element;
}

interface ISpinnerIcon {
  CustomSpinner?: JSX.Element;
}

const Check: FC<ICheckIcon> = ({ CustomCheck }) =>
  CustomCheck ? (
    CustomCheck
  ) : (
    <CgCheck className="text-2xl ml-2 pointer-events-none text-green-500" />
  );

const Spinner: FC<ISpinnerIcon> = ({ CustomSpinner }) =>
  CustomSpinner ? (
    CustomSpinner
  ) : (
    <RiLoader4Line className="text-xl ml-3 mr-1 pointer-events-none text-red-500 animate-spin-slow" />
  );

interface Props {
  isCompleted: boolean;
  CustomCheck?: JSX.Element;
  CustomSpinner?: JSX.Element;
}

const CompletedCheck: FC<Props> = ({
  isCompleted,
  CustomCheck,
  CustomSpinner,
}) =>
  isCompleted ? (
    <Check CustomCheck={CustomCheck} />
  ) : (
    <Spinner CustomSpinner={CustomSpinner} />
  );

export { CompletedCheck };
