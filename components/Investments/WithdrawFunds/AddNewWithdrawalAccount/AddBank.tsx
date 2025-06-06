"use client";
import Button from "@/components/ui/Button";
import { XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/apiHelper";


interface AddBankInformationProps {
  onClose: () => void;
}

// Define interface for form data
interface FormData {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  bankAddress: string;
  // beneficiaryAddress: string;
  swiftCode: string;
  routingNumber: string;
}

interface Errors {
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  bankAddress?: string;
  // beneficiaryAddress?: string;
  swiftCode?: string;
  routingNumber?: string;
}

export default function AddBankInformation({
  onClose,
}: AddBankInformationProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const [formData, setFormData] = useState<FormData>({
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    bankAddress: "",
    // beneficiaryAddress: "",
    swiftCode: "", // Optional
    routingNumber: "", // Optional
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
    setErrors((prev: Errors) => ({ ...prev, [name]: "" })); // Clear error on change
  };
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(
    null
  );

  // Handle Form Submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form submission

    // Basic validation for required fields
    const newErrors: Errors = {};
    if (!formData.bankName) newErrors.bankName = "Bank Name is required.";
    if (!formData.accountNumber)
      newErrors.accountNumber = "Account Number is required.";
    if (!formData.accountHolderName)
      newErrors.accountHolderName = "Account Holder Name is required.";
    if (!formData.bankAddress)
      newErrors.bankAddress = "Bank Address is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set the error state
      return; // Exit early if there are validation errors
    }

    setIsLoading(true);

    // Retrieve the access token (assuming it's in localStorage)
    // const token = localStorage.getItem("accessToken");

    // if (!token) {
    //   alert("You must be logged in to add bank details.");
    //   setIsLoading(false);
    //   return;
    // }

    // API call to submit the form data
    try {
      const response = await apiFetch(
        "/bank",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            accountName: formData.accountHolderName, // Map accountHolderName to accountName
            bankAddress: formData.bankAddress,
            swiftCode: formData.swiftCode || "", // Send empty string if not provided
            routingNumber: formData.routingNumber || "", // Send empty string if not provided
            // beneficiaryAddress: formData.beneficiaryAddress || "",
          }),
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        setFeedbackType("success");
        setFeedbackMessage("Bank Details Added successfully!");
        // Wait for 1 second before closing the modal and reloading the page
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
      } else {
        alert(result.message || "An error occurred. Please try again.");
      }
      if (response.status === 401) {
        router.push("/auth/login/with-mail");
      }
    } catch (error) {
      console.error("Error submitting bank details:", error);
      alert("Failed to submit bank details. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-end bg-[#D9D9D9A6] justify-end lg:items-center lg:justify-center z-[100]">
      <div className="flex flex-col bg-white rounded-t-[15px] w-full h-[560px] lg:h-[575px] lg:rounded-[20px] lg:max-w-[621px]">
        <div className="flex items-center border-b w-full p-4">
         
          <p className="text-color-zero font-semibold text-lg mx-auto relative right-4">
            Add Bank Details
          </p>
          <p
            onClick={onClose}
            className="text-color-form text-sm cursor-pointer"
          >
           <XCircleIcon className="text-color-form"/>
          </p>
        </div>
        <div className="flex flex-col bg-white">
          <p className="text-color-form text-sm px-4 pt-1">
            Provide your bank account details
          </p>
          <form
            className="flex flex-col space-y-3 p-4 md:space-y-3"
            onSubmit={handleFormSubmit}
          >
            {/* Bank Name */}
            <div className="flex flex-col gap-2">
              <label className="text-color-form text-sm">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                required
                className="rounded-sm border-b border-slate-200 text-color-zero"
                placeholder="Citi Bank"
              />
              {errors.bankName && <p className="text-red-500 text-xs">{errors.bankName}</p>}
            </div>

            {/* Account Number */}
            <div className="flex flex-col gap-2">
              <label className="text-color-form text-sm">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                required
                className="rounded-sm border-b border-slate-200 text-color-zero"
                placeholder="2010100191"
              />
              {errors.accountNumber && <p className="text-red-500 text-xs">{errors.accountNumber}</p>}
            </div>

            {/* Account Holder Name */}
            <div className="flex flex-col gap-2">
              <label className="text-color-form text-sm">Account Holder Name</label>
              <input
                type="text"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleChange}
                required
                className="rounded-sm border-b border-slate-200 text-color-zero"
                placeholder="Cooper Winterwind"
              />
              {errors.accountHolderName && <p className="text-red-500 text-xs">{errors.accountHolderName}</p>}
            </div>

            {/* Bank Address */}
            <div className="flex flex-col gap-2">
              <label className="text-color-form text-sm">Bank Address</label>
              <input
                type="text"
                name="bankAddress"
                value={formData.bankAddress}
                onChange={handleChange}
                required
                className="rounded-sm border-b border-slate-200 text-color-zero"
                placeholder="21 Old Lane, Wall Street"
              />
              {errors.bankAddress && <p className="text-red-500 text-xs">{errors.bankAddress}</p>}
            </div>

            {/* IBAN/SWIFT Code */}
            <div className="flex flex-col gap-2">
              <label className="text-color-form text-sm">IBAN/Swift Code (Optional)</label>
              <input
                type="text"
                name="swiftCode"
                value={formData.swiftCode}
                onChange={handleChange}
                className="rounded-sm border-b border-slate-200 text-color-zero"
                placeholder="099794"
              />
            </div>

            {/* Routing Number */}
            <div className="flex flex-col gap-2">
              <label className="text-color-form text-sm">Routing Number (Optional)</label>
              <input
                type="text"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={handleChange}
                className="rounded-sm border-b border-slate-200 text-color-zero"
                placeholder="67897943"
              />
            </div>

            {/* Beneficiary Address */}
            {/* <div className="flex flex-col gap-1">
              <label className="text-color-form text-sm">Beneficiary Address</label>
              <input
                type="text"
                name="beneficiaryAddress"
                value={formData.beneficiaryAddress}
                onChange={handleChange}
                required
                className="rounded-sm border-b border-slate-200 text-color-zero"
                placeholder="30 New Lane, Alabama"
              />
              {errors.beneficiaryAddress && <p className="text-red-500 text-xs">{errors.beneficiaryAddress}</p>}
            </div> */}
            {feedbackMessage && (
            <div
              className={`my-1 text-sm ${
                feedbackType === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {feedbackMessage}
            </div>
          )}
          <p className="text-color-one text-sm">NB: This page will reload after you submit.</p>
            <Button
              ButtonText={isLoading ? "Saving..." : "Save"}
              className={`py-3 bg-color-one hover:bg-green-700`}
              type="submit"
              disabled={isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
