"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent as ShadcnSidebarContent,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarRail as ShadcnSidebarRail,
  SidebarTrigger as ShadcnSidebarTrigger,
  useSidebar as useShadcnSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  useLink,
  useMenu,
  type TreeMenuItem,
} from "@refinedev/core";
import { ChevronRight, ListIcon } from "lucide-react";
import React from "react";
import {UserInfo} from "@/components/refine-ui/layout/user-info.tsx";

export function Sidebar() {
    const { open } = useShadcnSidebar();
    const { menuItems, selectedKey } = useMenu();

    return (
        <ShadcnSidebar collapsible="icon" className={cn("border-none")}>
            <ShadcnSidebarRail />

            <SidebarHeader />

            <ShadcnSidebarContent
                className={cn(
                    "flex",
                    "flex-1",
                    "flex-col",
                    "gap-2",
                    "overflow-y-auto",
                    "border-r",
                    "border-border",
                    "pt-2",
                    "pb-2",
                    "transition-discrete",
                    "duration-200",
                    {
                        "px-3": open,
                        "px-1": !open,
                    }
                )}
            >
                {menuItems.map((item: TreeMenuItem) => (
                    <SidebarItem
                        key={item.key || item.name}
                        item={item}
                        selectedKey={selectedKey}
                    />
                ))}
            </ShadcnSidebarContent>

            <div
                className={cn(
                    "border-r",
                    "border-t",
                    "border-border",
                    "p-2"
                )}
            >
                <UserInfo />
            </div>
        </ShadcnSidebar>
    );
}

type MenuItemProps = {
  item: TreeMenuItem;
  selectedKey?: string;
};

function SidebarItem({ item, selectedKey }: MenuItemProps) {
  const { open } = useShadcnSidebar();

  if (item.meta?.group) {
    return <SidebarItemGroup item={item} selectedKey={selectedKey} />;
  }

  if (item.children && item.children.length > 0) {
    if (open) {
      return <SidebarItemCollapsible item={item} selectedKey={selectedKey} />;
    }
    return <SidebarItemDropdown item={item} selectedKey={selectedKey} />;
  }

  return <SidebarItemLink item={item} selectedKey={selectedKey} />;
}

function SidebarItemGroup({ item, selectedKey }: MenuItemProps) {
  const { children } = item;
  const { open } = useShadcnSidebar();

  return (
    <div className={cn("border-t", "border-sidebar-border", "pt-4")}>
      <span
        className={cn(
          "ml-3",
          "block",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-muted-foreground",
          "transition-all",
          "duration-200",
          {
            "h-8": open,
            "h-0": !open,
            "opacity-0": !open,
            "opacity-100": open,
            "pointer-events-none": !open,
            "pointer-events-auto": open,
          }
        )}
      >
        {getDisplayName(item)}
      </span>
      {children && children.length > 0 && (
        <div className={cn("flex", "flex-col")}>
          {children.map((child: TreeMenuItem) => (
            <SidebarItem
              key={child.key || child.name}
              item={child}
              selectedKey={selectedKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarItemCollapsible({ item, selectedKey }: MenuItemProps) {
  const { name, children } = item;

  const chevronIcon = (
    <ChevronRight
      className={cn(
        "h-4",
        "w-4",
        "shrink-0",
        "text-muted-foreground",
        "transition-transform",
        "duration-200",
        "group-data-[state=open]:rotate-90"
      )}
    />
  );

  return (
    <Collapsible key={`collapsible-${name}`} className={cn("w-full", "group")}>
      <CollapsibleTrigger asChild>
        <SidebarButton item={item} rightIcon={chevronIcon} />
      </CollapsibleTrigger>
      <CollapsibleContent className={cn("ml-6", "flex", "flex-col", "gap-2")}>
        {children?.map((child: TreeMenuItem) => (
          <SidebarItem
            key={child.key || child.name}
            item={child}
            selectedKey={selectedKey}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function SidebarItemDropdown({ item, selectedKey }: MenuItemProps) {
    const { children } = item;
    const Link = useLink();
    const { isMobile, setOpenMobile } = useShadcnSidebar();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarButton item={item} />
            </DropdownMenuTrigger>

            <DropdownMenuContent side="right" align="start">
                {children?.map((child: TreeMenuItem) => {
                    const childKey = child.key;
                    const isSelected = childKey === selectedKey;

                    return (
                        <DropdownMenuItem key={childKey || child.name} asChild>
                            <Link
                                to={child.route || ""}
                                onClick={() => {
                                    if (isMobile) {
                                        setOpenMobile(false);
                                    }
                                }}
                                className={cn("flex w-full items-center gap-2", {
                                    "bg-accent text-accent-foreground": isSelected,
                                })}
                            >
                                <ItemIcon
                                    icon={child.meta?.icon ?? child.icon}
                                    isSelected={isSelected}
                                />
                                <span>{getDisplayName(child)}</span>
                            </Link>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function SidebarItemLink({ item, selectedKey }: MenuItemProps) {
    const isSelected = item.key === selectedKey;
    const { isMobile, setOpenMobile } = useShadcnSidebar();

    return (
        <SidebarButton
            item={item}
            isSelected={isSelected}
            asLink={true}
            onClick={() => {
                if (isMobile) {
                    setOpenMobile(false);
                }
            }}
        />
    );
}

function SidebarHeader() {
    const { open, isMobile } = useShadcnSidebar();

    return (
        <ShadcnSidebarHeader
            className={cn(
                "h-16 border-b border-border p-0",
                "flex-row items-center justify-between overflow-hidden"
            )}
        >
            <div
                className={cn(
                    "flex h-full min-w-0 items-center gap-3 overflow-hidden",
                    "transition-all duration-200",
                    open ? "px-4" : "justify-center px-2"
                )}
            >
                <img
                    src="/truehome.png"
                    alt="TRUEHOME"
                    className={cn(
                        "shrink-0 object-contain",
                        open ? "h-20 w-20" : "h-24 w-24"
                    )}
                />

                <div
                    className={cn(
                        "min-w-0 transition-opacity duration-150",
                        open ? "opacity-100" : "hidden opacity-0"
                    )}
                >
                    <div className="whitespace-nowrap text-sm font-bold tracking-[0.08em] text-foreground">
                        TRUEHOME
                    </div>
                </div>
            </div>

            <ShadcnSidebarTrigger
                className={cn(
                    "mr-1.5 shrink-0 text-muted-foreground",
                    {
                        "opacity-0 pointer-events-none": !open && !isMobile,
                    }
                )}
            />
        </ShadcnSidebarHeader>
    );
}


function getDisplayName(item: TreeMenuItem) {
  return item.meta?.label ?? item.label ?? item.name;
}

type IconProps = {
  icon: React.ReactNode;
  isSelected?: boolean;
};

function ItemIcon({ icon, isSelected }: IconProps) {
  return (
    <div
      className={cn("w-4", {
        "text-muted-foreground": !isSelected,
        "text-sidebar-primary-foreground": isSelected,
      })}
    >
      {icon ?? <ListIcon />}
    </div>
  );
}

type SidebarButtonProps = React.ComponentProps<typeof Button> & {
  item: TreeMenuItem;
  isSelected?: boolean;
  rightIcon?: React.ReactNode;
  asLink?: boolean;
  onClick?: () => void;
};

function SidebarButton({
  item,
  isSelected = false,
  rightIcon,
  asLink = false,
  className,
  onClick,
  ...props
}: SidebarButtonProps) {
  const Link = useLink();

  const buttonContent = (
    <>
      <ItemIcon icon={item.meta?.icon ?? item.icon} isSelected={isSelected} />
      <span
        className={cn("tracking-[-0.00875rem]", {
          "flex-1": rightIcon,
          "text-left": rightIcon,
          "line-clamp-1": !rightIcon,
          truncate: !rightIcon,
          "font-normal": !isSelected,
          "font-semibold": isSelected,
          "text-sidebar-primary-foreground": isSelected,
          "text-foreground": !isSelected,
        })}
      >
        {getDisplayName(item)}
      </span>
      {rightIcon}
    </>
  );

  return (
    <Button
      asChild={!!(asLink && item.route)}
      variant="ghost"
      size="lg"
      className={cn(
        "flex w-full items-center justify-start gap-2 py-2 !px-3 text-sm",
        {
          "bg-sidebar-primary": isSelected,
          "hover:!bg-sidebar-primary/90": isSelected,
          "text-sidebar-primary-foreground": isSelected,
          "hover:text-sidebar-primary-foreground": isSelected,
        },
        className
      )}
      onClick={onClick}
      {...props}
    >
      {asLink && item.route ? (
        <Link to={item.route} className={cn("flex w-full items-center gap-2")}>
          {buttonContent}
        </Link>
      ) : (
        buttonContent
      )}
    </Button>
  );
}

Sidebar.displayName = "Sidebar";
