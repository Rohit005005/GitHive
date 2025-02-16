"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { Bot, Github, LayoutDashboard, Linkedin, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const { projects, projectId, setProjectId } = useProject();
  const router = useRouter();

  const [isMounted, setIsMounted] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);

  React.useEffect(() => {
    // Set isMounted to true after the component has mounted
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      const pending = localStorage.getItem("createProjectPending");
      setIsDisabled(pending === "true");

      const handleStorageChange = () => {
        setIsDisabled(localStorage.getItem("createProjectPending") === "true");
      };

      window.addEventListener("projectPendingChanged", handleStorageChange);
    
      return () => {
        window.removeEventListener("projectPendingChanged", handleStorageChange);
      };
    }
  }, [isMounted]); 

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Saved Q&A",
      url: "/qa",
      icon: Bot,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="floating" className={isDisabled ? "pointer-events-none opacity-50" : ""}>
      <SidebarContent className="rounded-md bg-gray-800 text-white">
        {open && (
          <SidebarHeader className="flex flex-row items-center justify-center">
            <Github className="animate-pulse-scale h-5 w-5 text-green-400" />
            <h1 className="text-xl font-bold text-white transition-transform duration-300 hover:scale-105 md:text-2xl">
              GitHive
            </h1>
          </SidebarHeader>
        )}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            Application
          </SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-gray-700 hover:text-white"
                    >
                      <Link
                        href={item.url}
                        className={cn({
                          "!bg-primary !text-white": pathname === item.url,
                        })}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            Your Projects
          </SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu>
              {projects?.map((project) => {
                return (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton
                      asChild
                      onClick={() => {
                        router.push("/dashboard");
                      }}
                      className="hover:bg-gray-700 hover:text-white"
                    >
                      <div
                        onClick={() => {
                          setProjectId(project.id);
                        }}
                      >
                        <div
                          className={cn(
                            "flex size-6 items-center justify-center rounded-sm bg-green-700 p-2 text-sm text-white",
                            {
                              "size-7 bg-primary text-lg text-white":
                                project.id === projectId,
                            },
                          )}
                        >
                          {project.name[0]}
                        </div>
                        <span>{project.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <div className="h-2"></div>
              {open && (
                <SidebarMenuItem>
                  <Link href={"/create"}>
                    <Button size="sm">
                      <Plus /> Create Project
                    </Button>
                  </Link>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      {open && (
        <div className="rounded-md bg-gray-700 p-1">
          <Popover>
            <PopoverTrigger className="flex w-full items-center justify-center gap-2">
              <p className="font-playwrite text-sm text-gray-200">
                Made by
              </p>
              <p className="text-md font-playwrite font-bold text-primary">
                Rohit
              </p>
            </PopoverTrigger>
            <PopoverContent onClick={()=>{
              window.open("https://www.linkedin.com/in/rohit-dev005/")
            }} className="bg-gray-700 px-5 py-2 text-center w-fit border-gray-600 space-y-1">
              <p className="text-gray-300 text-sm">Get in Touch</p>
              <div className="flex items-start justify-center gap-2">
              <Linkedin size={20} className="text-primary"/>
              <p className="font-bold text-md text-gray-200">LinkedIn</p></div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </Sidebar>
  );
}