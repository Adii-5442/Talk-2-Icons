"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Menu ,Sparkles} from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { MobileSideBar } from "./mobile-sidebar";
import Image from "next/image";
import { useProModal } from "@/hooks/use-pro-modal";

const font = Poppins({
  weight: "600",
  subsets: ["latin"],
});

export const NavBar = () => {

  const proModal = useProModal()
    return (
      <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 h-16">
        <div className="flex items-center">
          <MobileSideBar />
          <Link href="/">
            <div className="flex flex-row align-middle justify-center">
              <Image
                style={{ alignSelf: "center" }}
                width={64}
                height={64}
                alt="Empty"
                src={"/logoa.png"}
              />
              <h1
                className={cn(
                  "hidden md:block text-xl md:text-3xl font-bold text-primary ml-5",
                  font.className
                )}
                style={{ alignSelf: "center" }}>
                celebchat.ai
              </h1>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-x-3">
          <Button onClick={proModal.onOpen}
            className="variant-premium premium-button-bg text-white border-0"
            size="sm">
            Upgrade
            <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
          </Button>
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    );
};