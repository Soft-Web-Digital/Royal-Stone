import Icon from "@/components/ui/Icon";
import Loading from "@/components/ui/Loading";
import NoHistory from "@/components/ui/NoHistory";
import TableHeader from "@/components/ui/TableHeader";
import { useState } from "react";
import { BsFileBarGraphFill } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { IoIosArrowForward, IoIosSend } from "react-icons/io";
import TransactionHistoryModal from "./TransactionHistoryModal";
import { apiFetch } from "@/utils/apiHelper";

interface Investments {
  id: string;
  type: string;
  amount: number;
  createdAt: string;
  status: string;
}

export default function AllHistoryDesktop({
  investments,
}: {
  investments: Investments[];
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investments | null>(null);

  const fetchInvestmentDetails = async (id: string, type: string) => {
    // const token = localStorage.getItem("accessToken");
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch(
        `/investment?type=${type}`,
        {
          method: "GET",
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (!data.status) {
        throw new Error("Failed to fetch investment details.");
      }

      const investmentDetails = data.data.data.find(
        (investment: Investments) => investment.id === id
      );

      if (!investmentDetails) {
        throw new Error("Investment not found.");
      }

      setSelectedInvestment(investmentDetails);
      setShowModal(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err.message || "Failed to fetch data. Please try again later."
        );
      } else {
        setError("An unknown error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="hidden mt-7 lg:grid">
      {error && <p className="text-red-500">{error}</p>}
      {investments.length > 0 ? (
        <>
          <TableHeader />
          {investments.map((investment) => (
            <section
              key={investment.id}
              className="grid grid-cols-7 px-3 mr-8 border-b py-4 my-4"
            >
              <div className="flex items-center gap-3 col-span-2">
                <Icon
                  icon={
                    investment.type === "investment-wallet-funding" ? (
                      <GoPlus className="text-color-one" />
                    ) : investment.type === "investment-purchase" ? (
                      <BsFileBarGraphFill className="text-color-one" />
                    ) : (
                      <IoIosSend className="text-color-one" />
                    )
                  }
                />
                <p className="text-sm text-color-zero">
                  {investment.type
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </p>
              </div>
              <p className="text-sm text-color-zero">${investment.amount}</p>
              <p className="text-sm text-color-zero col-span-2">
                {new Date(investment.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                |{" "}
                {new Date(investment.createdAt).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <p
                className={`text-sm ${
                  investment.status === "pending"
                    ? "text-yellow-500"
                    : investment.status === "ongoing"
                    ? "text-blue-500"
                    : investment.status === "matured" ||
                      investment.status === "successful"
                    ? "text-green-500"
                    : investment.status === "canceled" ||
                      investment.status === "failed"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {investment.status
                  ? investment.status.charAt(0).toUpperCase() +
                    investment.status.slice(1)
                  : "N/A"}
              </p>

              <button
                onClick={() =>
                  fetchInvestmentDetails(investment.id, investment.type)
                }
                className="flex items-center justify-center border rounded-[20px] gap-2 w-[78px] py-1 hover:border-green-700 hover:text-green-700 duration-150"
                disabled={loading}
              >
                <p className="text-xs text-color-form hover:text-green-700">
                  View
                </p>
                <IoIosArrowForward className="text-color-form text-sm hover:text-green-700" />
              </button>
            </section>
          ))}
        </>
      ) : (
        <div className="lg:mr-8">
        <NoHistory
          icon={<BsFileBarGraphFill />}
          text="No Recent Transactions Yet."
        />
      </div>
      )}

      {/* Modal for displaying investment details */}
      {showModal && selectedInvestment && (
        <TransactionHistoryModal
          investment={selectedInvestment}
          closeModal={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
