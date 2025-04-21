import { LoginForm } from "@/components/auth/login-form";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 dark:from-gray-800 dark:via-gray-600 dark:to-gray-700 min-h-svh md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
