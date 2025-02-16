"use client";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { user } = useUser();
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2 text-white">
        <SidebarTrigger/>
        <h1 className="text-md font-playwrite md:text-md text-white transition-transform duration-300 hover:scale-105">
          Welcome
        </h1>
        <p className="text-md font-playwrite md:text-md text-primary transition-transform duration-300 hover:scale-105">
          {user?.firstName}
        </p>
      </div>
      <div className="flex items-center gap-5 ">
        <Link href={'/'} className="rounded-md border border-gray-500 px-3 py-1 text-gray-300 text-sm hover:text-white">
          <SignOutButton />
        </Link>
        <UserButton />
      </div>
    </div>
  );
};

export default Header;
