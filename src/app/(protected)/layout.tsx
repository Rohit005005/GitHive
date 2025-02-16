"use client"
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./app-sidebar";
import Header from "./header";

type Props = {
  children: React.ReactNode;
};
const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-2 w-full ">
        <div className="flex items-center gap-2 rounded-md p-2 px-4 shadow bg-gray-800">

          <Header />
          
        </div>

        {/*Main content */}
        <div className="h-[calc(100vh-5rem)] overflow-y-scroll sm:scrollbar-webkit scrollbar-webkit-mobile rounded-md bg-sidebar p-4 shadow mt-4 bg-gradient-to-b from-gray-900 to-gray-800">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;
