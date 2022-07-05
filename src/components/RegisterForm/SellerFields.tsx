import React, { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { CgCheck } from "react-icons/cg";

interface Props {
  storeRegister: UseFormRegisterReturn | null;
  nameRegister: UseFormRegisterReturn;
  validStoreField: boolean;
  validNameField: boolean;
}

const SellerFields: FC<Props> = ({
  storeRegister,
  nameRegister,
  validStoreField,
  validNameField,
}) => (
  <div className="flex flex-col md:mt-2 w-auto">
    <div className="form-field">
      <h1 className="title">My store name:</h1>
      <div className="relative flex flex-row items-center">
        <input
          spellCheck={false}
          autoComplete="off"
          className="relative w-full py-2 md:py-2 pl-3 my-2 md:my-4 font-Basic text-left bg-white rounded-lg shadow-md focus:outline-black"
          {...storeRegister}
        />
        {validStoreField && (
          <CgCheck className="absolute text-green-500 text-3xl right-1 pointer-events-none" />
        )}
      </div>
    </div>
    <div className="form-field">
      <h1 className="title">My name:</h1>
      <div className="relative flex flex-row items-center">
        <input
          spellCheck={false}
          autoComplete="off"
          className="relative w-full py-2 md:py-2 pl-3 my-2 md:my-4 font-Basic text-left bg-white rounded-lg shadow-md focus:outline-black"
          {...nameRegister}
        />
        {validNameField && (
          <CgCheck className="absolute text-green-500 text-3xl right-1 pointer-events-none" />
        )}
      </div>
      <p className="font-Lato text-gray-300 mt-[-1px] md:mt-[-0.5em]">
        Your name is saved in a secure database.
      </p>
    </div>
  </div>
);

export { SellerFields };
