import { FC } from "react";
import { KeyedMutator } from "swr";
import { ItemEntity, ListingEntity } from "../../types";

interface FormData {
  name: string;
  price: number;
  image: string;
  description: string;
  items: string[];
}

interface Props {
  items?: ItemEntity[];
  listings?: ListingEntity[];
  mutate: KeyedMutator<ListingEntity[]>;
}

const CreateOrder: FC<Props> = ({ items, listings, mutate }) => {
  return <></>;
  // const [onSuccess, setOnSuccess] = useState<boolean>(false);
  // const [currency, setCurrency] = useState<string>("USD");
  // const [selectItemIds, setSelectItemIds] = useState<string[] | null>(null);
  // const [validImageField, setValidImageField] = useState<boolean>(false);

  // const { price: ethRate } = useEthPrice();

  // const { handleSubmit, register, watch, setValue } = useForm<FormData>();

  // const nextListingsCount = listings ? listings?.length + 1 : 1;

  // // Handle submit
  // const onSubmit = async (values: FormData) => {
  //   const { price, ...rest } = values;

  //   if (!ethRate) {
  //     console.log(
  //       "ETH price could not be fetched. Listing won't be created. Try again later."
  //     );
  //     return;
  //   }

  //   // Get prices formatted for db
  //   const prices = getPriceData({ currency, inputPrice: price, ethRate });

  //   // Create listing
  //   const { data, status } = await axios.post("/api/listings", {
  //     ...rest,
  //     items: items ?? [],
  //     prices,
  //   });

  //   if (status !== 200) {
  //     return setOnSuccess(false);
  //   }

  //   mutate([...[items], data]);
  //   setOnSuccess(true);

  //   console.log(data, status);
  // };

  // // Form fields registration
  // const nameRegister: UseFormRegisterReturn = register("name", {
  //   required: "A name for your listing is required.",
  // });
  // const imageRegister: UseFormRegisterReturn = register("image", {
  //   required: "A picture for your listing is required.",
  // });
  // const priceRegister: UseFormRegisterReturn = register("price", {
  //   required: "What's a good price for your listing?",
  // });
  // const descriptionRegister: UseFormRegisterReturn = register("description", {
  //   required: "A description for your listing is required.",
  // });

  // const validNameField = !!(watch("name") && watch("name").length > 2);
  // const validPriceField = watch("price") > 0;
  // const validDescriptionField = !!watch("description");

  // const isCompleted =
  //   validNameField &&
  //   validImageField &&
  //   validPriceField &&
  //   validDescriptionField;

  // const nextButtonText = !isCompleted
  //   ? "Please complete all fields"
  //   : "Looks good. Create listing";

  // const priceCurrencyFieldProps = {
  //   priceRegister,
  //   validPriceField,
  //   currency,
  //   setCurrency,
  //   ethRate,
  //   setValue,
  // };
  // const itemsSelectProps = { items, selectItemIds, setSelectItemIds };
  // const previewProps = {
  //   watch,
  //   currency,
  //   validImageField,
  //   setValidImageField,
  //   items,
  //   selectItemIds,
  // };
  // const dialogProps = {
  //   isOpen: onSuccess,
  //   setIsOpen: setOnSuccess,
  //   type: "success",
  //   message: "Your listing was successfully created!",
  // };

  // return (
  //   <div className="flex flex-row md:grid md:grid-cols-2 min-h-[calc(100vh-5rem)] px-6 md:px-0">
  //     <form
  //       onSubmit={handleSubmit(onSubmit)}
  //       className="flex flex-col items-center w-full md:pl-[30%] md:pr-[10%] py-[10%]"
  //     >
  //       <h1 className="text-4xl md:text-6xl font-Basic tracking-tighter self-start mb-12 md:mb-8">
  //         Create a Listing.
  //       </h1>

  //       {/* Name */}
  //       <div className="form-field w-full md:py-3">
  //         <h1 className="title">Give your listing a name.</h1>
  //         <div className="relative flex flex-row items-center">
  //           <input
  //             spellCheck={false}
  //             autoComplete="off"
  //             className={`relative w-full py-2 pl-3 pr-8 my-2 md:my-4 text-left bg-white rounded-lg shadow-md focus:outline-black ${
  //               !validNameField && "animate-pulse pr-0"
  //             }`}
  //             placeholder={`My Listing #${nextListingsCount}`}
  //             {...nameRegister}
  //           />
  //           {validNameField && (
  //             <CgCheck className="absolute text-green-500 text-3xl right-1 pointer-events-none" />
  //           )}
  //         </div>
  //       </div>

  //       {/* Image URL */}
  //       <div className="form-field w-full md:py-3">
  //         <h1 className="relative title flex flex-row items-baseline">
  //           Add a picture URL for your listing.{" "}
  //           <Tooltip label="For testing purposes, we'll treat the image as a URL. Find one in Google Images.">
  //             <div className="hidden md:flex justify-center items-center text-white bg-primary italic text-[9pt] rounded-full h-4 w-4 ml-2 pr-1">
  //               i
  //             </div>
  //           </Tooltip>
  //         </h1>
  //         <div className="relative flex flex-row items-center">
  //           <input
  //             spellCheck={false}
  //             autoComplete="off"
  //             className={`relative w-full py-2 pl-3 pr-8 my-2 md:my-4 text-left bg-white rounded-lg shadow-md focus:outline-black truncate ${
  //               !validImageField && "animate-pulse pr-0"
  //             }`}
  //             placeholder="https://www.carlogos.org/car-logos/tesla-logo-2200x2800.png"
  //             {...imageRegister}
  //           />
  //           {!watch("image") ? null : validImageField ? (
  //             <CgCheck className="absolute text-green-500 text-3xl right-1 pointer-events-none" />
  //           ) : (
  //             <IoCloseSharp className="absolute text-red-600 text-xl right-2 pointer-events-none" />
  //           )}
  //         </div>
  //       </div>

  //       {/* Price */}
  //       <div className="form-field w-full md:py-3">
  //         <PriceCurrencyField {...priceCurrencyFieldProps} />
  //       </div>

  //       {/* Description */}
  //       <div className="form-field w-full md:py-3">
  //         <h1 className="title">Description.</h1>
  //         <div className="relative flex flex-row items-center">
  //           <textarea
  //             autoComplete="off"
  //             className={`relative resize w-full py-2 md:py-2 pl-3 my-2 md:my-4 text-left bg-white rounded-lg shadow-md focus:outline-black min-h-[5rem] min-w-full max-w-full ${
  //               !validDescriptionField && "animate-pulse"
  //             }`}
  //             placeholder="Say something nice about your product."
  //             {...descriptionRegister}
  //           />
  //           {validDescriptionField && (
  //             <CgCheck className="absolute text-green-500 text-3xl right-1 top-5 pointer-events-none" />
  //           )}
  //         </div>
  //       </div>

  //       {/* Items */}
  //       <div className="form-field w-full md:py-3">
  //         <ItemsSelect {...itemsSelectProps} />
  //       </div>

  //       {/* Create Listing */}
  //       <button
  //         type="submit"
  //         disabled={!isCompleted}
  //         className={`flex justify-center font-Basic items-center rounded-full text-white mt-12 py-3 px-6 pr-4 w-full ${
  //           isCompleted ? "bg-primary hover:bg-black" : "bg-gray-600"
  //         }`}
  //       >
  //         {nextButtonText}
  //         <CompletedCheck
  //           isCompleted={isCompleted}
  //           CustomSpinner={
  //             <RiLoader4Line className="text-xl ml-3 mr-1 pointer-events-none text-white animate-spin-slow" />
  //           }
  //         />
  //       </button>
  //     </form>

  //     {/* Desktop Preview */}
  //     <div className="hidden md:flex flex-col sticky top-20 w-full h-[calc(100vh-5rem)]">
  //       <Preview {...previewProps} />
  //     </div>

  //     {/* Success/failure Modal */}
  //     <Dialog {...dialogProps} />
  //   </div>
  // );
};

export { CreateOrder };
