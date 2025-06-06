import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import Timer from "@/components/ui/Timer";
import { FundCryptoWalletDetails } from "@/types/Type";
import { XCircleIcon } from "lucide-react";
import { useEffect } from "react";
import StatRow from "./StatRow";

interface MyComponentProps {
  onClose: () => void;
  onProceed: () => void;
  walletDetails: FundCryptoWalletDetails | null;
  error: string | null;
  isLoading: boolean;
  amount: string | number;
  successMessage: string | null;
  heading: string;
  transactionType: string;
}

export default function CryptoFunding({
  onClose,
  onProceed,
  error,
  walletDetails,
  isLoading,
  amount,
  successMessage,
  heading,
  transactionType,
}: MyComponentProps) {
  useEffect(() => {
    // Disable scrolling when the modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 flex bg-[#D9D9D9A6] items-end lg:items-center justify-end lg:justify-center z-[100]">
      <div className="bg-white flex flex-col rounded-[20px] h-[484px] w-full lg:max-w-[621px] lg:h-[484px]">
        <div className="flex justify-center items-center mt-4 lg:hidden">
          <hr className="w-[51px] h-[5px] rounded-[40px] bg-[#D9D9D9]" />
        </div>
        <div className="flex items-center border-b w-full pb-2 p-4">
          <p className="text-color-zero font-semibold text-lg mx-auto relative right-4">
            {heading}
          </p>
          <p
            onClick={onClose}
            className="text-color-form text-sm cursor-pointer"
          >
            <XCircleIcon className="text-color-form"/>
          </p>
        </div>
        <p className="text-color-form text-sm mx-4 py-4">
          You are required to make a wallet transfer of ${amount} to the details
          provided within an hour to proceed with your {transactionType}.
        </p>
        <section className="flex flex-col justify-center items-center rounded-[10px] h-[91px] space-y-4 shadow-sm mx-4 text-sm lg:p-5 lg:w-[572px]">
          <p className="text-color-form">Timer</p>
          <Timer initialTime={3600} onTimeUp={onClose} />
        </section>
        <section className="flex flex-col mt-4 bg-light-grey mx-6 rounded-[10px] px-4 shadow-sm">
          <StatRow
            label="Amount"
            value={`$${amount}`}
            valueClass="text-color-six text-sm"
          />
          <StatRow
            label="Network"
            value={walletDetails?.name || "BTC"}
            valueClass="text-color-six text-sm"
          />
          <StatRow
            label="Wallet Address"
            value={walletDetails?.address || "Loading..."}
            valueClass="text-color-six text-sm"
            showCopyIcon
            isLast={true}
          />
        </section>
        {error && ( // Display error message conditionally
          <p className="text-red-600 p-3 rounded ml-4 mt-4 text-sm">{error}</p>
        )}
        {successMessage && ( // Display success message conditionally
          <p className="text-green-600 p-3 rounded ml-4 mt-4 text-sm">
            {successMessage}
          </p>
        )}
        {isLoading && (
          <div>
            <Loading />
          </div>
        )}
        {isLoading && <Loading />}
        {/* <hr className="mt-8" /> */}
        <div className="my-3 mx-6 lg:mt-7">
          <Button
            ButtonText={
              isLoading ? "Processing..." : "I have made the transfer"
            }
            className={`${
              isLoading ? "bg-inactive hover:bg-inactive" : "bg-color-one"
            }  w-full text-center`}
            onClick={onProceed}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
