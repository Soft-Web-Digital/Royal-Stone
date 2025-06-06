"use client";
import AllHistoryDesktop from "@/components/Savings/History/AllHistoryDesktop";
import AllHistoryMobile from "@/components/Savings/History/AllHistoryMobile";
import Navigator from "@/components/ui/Navigator";

const savingsHistory = [
  { label: "Fixed Savings", href: "/main/savings" },
  { label: "Savings History", href: "/main/savings/savings-history" },
];
export default function SavingsHistory() {
  return (
    <div className="mt-[8.5rem] sm:mt-[1rem] lg:mt-[6rem]">
      <Navigator currentStep={1} steps={savingsHistory} />
      <>
        <AllHistoryMobile />
        <AllHistoryDesktop />
      </>
    </div>
  );
}
