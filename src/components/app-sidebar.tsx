'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Home, LayoutDashboard, Search, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../Components/ui/sidebar';

const items = [
  {
    title: 'Part Time Connect',
    url: '/part-time-connect',
    icon: Home,
  },
  {
    title: 'Dashboard',
    url: '/part-time-connect/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Part Time Portal',
    url: '/part-time-connect/portal',
    icon: Calendar,
  },
  {
    title: 'Connect-drive',
    url: '/part-time-connect/connect-drive',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname(); // Get current path

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 rounded-md p-2 transition ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-300'}`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
