//app/login/layout.tsx
import AuthHeader from "@/components/ui/AuthHeader";
import Prompt from "@/components/ui/Prompt";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-white">
      <div className="lg:grid grid-cols-2 lg:p-0 gap-12">
        <div>
          <Prompt prompt="Welcome back! 1,000+ users are already on the path to smart investing. Ready to take the next step? 🤔"/>
        </div>
        <div className="flex flex-col">
          <AuthHeader title="Sign in to your Royal Stone Account"/>
          <div className="mt-[6rem] px-4 sm:p-12 lg:p-0 lg:mt-20">
            {children} {/* Ensure children are rendered here */}
          </div>
        </div>
      </div>
    </div>
  );
}

