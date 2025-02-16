import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="shadow-md rounded-2xl p-1 bg-primary">
        <SignIn />
      </div>
    </div>
  );
}
