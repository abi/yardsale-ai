import { SignUpButton } from "@clerk/clerk-react";

export function LandingPageView() {
  return (
    <div className="flex flex-col items-center justify-center h-full flex-1">
      <div className="mt-20">
        <h1 className="text-4xl font-bold mb-4">Yardsale AI</h1>
        <p className="text-lg mb-4">
          The easiest way to sell your stuff on Facebook Marketplace. Generate a
          listing in under 2 minutes with just a few pictures.
        </p>
        <SignUpButton redirectUrl="/" />
      </div>
    </div>
  );
}
