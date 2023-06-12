"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, {
  ReactNode,
  Ref,
  useEffect,
  useRef,
  useState,
  useContext,
  createContext,
} from "react";
import { BiLoader, BiMenu } from "react-icons/bi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { useToast } from "./ui/use-toast";
import { getProviders, useSession, signIn, signOut } from "next-auth/react";
import { FaUser, FaUserCircle } from "react-icons/fa";

const MenuContext = createContext<any>(null);

export default function Navbar() {
  const [isOpen, setOpen] = useState(false);

  const { data: session, status } = useSession();

  const menuRef = useRef<HTMLElement>();

  const { toast } = useToast();

  const toggleMenu = () => {
    setOpen((cur) => !cur);
  };

  const logOut = async () => {
    let username = session?.user?.name || "Unknown User";
    await signOut({ redirect: false });
    toast({
      title: "Logged Out",
      description: `You are no longer logged in as ${username}`,
    });
  };

  const logIn = () => {
    signIn();
  };

  // Menu Outside Click Handler
  useEffect(() => {
    if (typeof menuRef.current !== "object") return;

    function handleClick(e: MouseEvent) {
      if (
        e.target instanceof HTMLElement &&
        menuRef.current?.contains(e.target) === false
      ) {
        //Clicked outside of referenced html element (Menu)
        setOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <MenuContext.Provider value={{ toggleMenu }}>
      <nav className="sticky top-0 z-30 w-full min-w-fit border-gray-200  bg-gray-100 font-rubik shadow-sm dark:bg-gray-900 dark:shadow-md dark:shadow-gray-900">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <Link href={"/"} className="flex items-center">
            <Image
              alt="Feely Message Logo"
              width={80}
              height={80}
              src={"/feely-logo.svg"}
              className="mr-3 h-10 w-auto object-contain"
            />
            <span className=" self-center text-2xl font-bold  text-indigo-900 dark:text-white ">
              Feely Message
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex w-16 items-center rounded-lg  p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            onClick={toggleMenu}
          >
            <BiMenu className="max-h-8 w-full text-2xl" />
          </button>

          <NavMenu isOpen={isOpen} ref={menuRef}>
            {session ? (
              <>
                {/* Nav for logged in users */}
                <NavItem href="/">Home</NavItem>
                <NavItem href="/about">About</NavItem>
                <NavItem>
                  <button type="button" onClick={logOut}>
                    Logout
                  </button>
                </NavItem>

                <NavItem href="/profile">
                  <div className="flex items-center justify-end  gap-2">
                    <span className="md:hidden">Profile</span>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session?.user?.image || ""} />
                      <Image
                        alt={`Author's profile picture`}
                        src={session?.user?.image || ""}
                        width={40}
                        height={40}
                        onError={(e: any) => {
                          //Failed to load image, remove from dom
                          if (e.target) e.target.style.display = "none";
                        }}
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback>
                        <FaUserCircle />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </NavItem>
              </>
            ) : (
              <>
                {/* Nav for public */}
                <NavItem href="/">Home</NavItem>
                <NavItem href="/about">About</NavItem>

                <NavItem>
                  <button
                    type="button"
                    className="p-0 md:rounded-lg md:bg-violet-800 md:px-3 md:py-1 md:text-white"
                    onClick={logIn}
                  >
                    Login
                  </button>
                </NavItem>
              </>
            )}
            {status === "loading" && (
              <li className="flex items-center justify-end gap-2 py-2 pl-0 pr-4 font-light text-gray-500">
                <BiLoader className="animate-spin" />
                <span className="md:hidden">Loading session information</span>
              </li>
            )}
          </NavMenu>
        </div>
      </nav>
    </MenuContext.Provider>
  );
}

/**
 * Responsive wrapper for navigation items with Ref Forwarding
 */
const NavMenu = React.forwardRef(
  (props: { isOpen: boolean; children: ReactNode }, ref: Ref<any>) => {
    const { isOpen, children } = props;
    return (
      <div
        ref={ref}
        className={`w-full md:block md:w-auto  ${isOpen ? "block" : "hidden"}`}
      >
        <ul className="mt-4 flex  flex-col rounded-lg border border-gray-100   bg-gray-50 bg-opacity-50 px-2 py-2 text-lg font-semibold dark:border-gray-700  dark:bg-gray-700 md:mt-0 md:flex-row md:items-center md:space-x-4 md:border-0 md:bg-transparent    md:px-4">
          {children}
        </ul>
      </div>
    );
  }
);

/**
 * Single navigation item
 */
function NavItem({ href, children }: { href?: string; children: any }) {
  const { toggleMenu } = useContext(MenuContext);
  const currentPath = usePathname();
  const isActive = currentPath === href;

  if (href) {
    return (
      <li>
        <Link
          href={href}
          onClick={toggleMenu}
          className={`block rounded px-2 py-2 text-right  ${
            isActive
              ? " bg-blue-700 text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700 md:dark:text-blue-500"
              : " text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
          }`}
        >
          {children}
        </Link>
      </li>
    );
  }
  return <li className="block rounded px-2 py-2 text-right">{children}</li>;
}
