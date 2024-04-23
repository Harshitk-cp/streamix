"use client";

import { usePathname } from "next/navigation";
import { Fullscreen, KeyRound, MessageSquare, Users } from "lucide-react";

import { NavItem, NavItemSkeleton } from "./nav-item";
import { useEffect, useState } from "react";

export const Navigation = () => {
  const pathname = usePathname();

  const [user, setUser] = useState({});
  useEffect(() => {
    const _user = JSON.parse(localStorage.getItem("user"));
    setUser(_user);
  }, []);

  const routes = [
    {
      label: "Stream",
      href: `/u/${user.userName}`,
      icon: Fullscreen,
    },
    {
      label: "Keys",
      href: `/u/${user.userName}/keys`,
      icon: KeyRound,
    },
    {
      label: "Chat",
      href: `/u/${user.userName}/chat`,
      icon: MessageSquare,
    },
    {
      label: "Community",
      href: `/u/${user.userName}/community`,
      icon: Users,
    },
  ];

  if (!user.userName) {
    return (
      <ul className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <NavItemSkeleton key={i} />
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-2 px-2 pt-4 lg:pt-0">
      {routes.map((route) => (
        <NavItem
          key={route.href}
          label={route.label}
          icon={route.icon}
          href={route.href}
          isActive={pathname === route.href}
        />
      ))}
    </ul>
  );
};
