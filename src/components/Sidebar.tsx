'use client';

import { useState } from 'react';
import { FaUser, FaChartBar, FaCog } from 'react-icons/fa';
import { IoMdArrowDropright, IoMdArrowDropleft } from 'react-icons/io';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    name: 'Part Time Connect',
    icon: <FaUser className="text-white" />,
    subMenu: [
      { name: 'Profile', path: '/part-time-connect/profile' },
      { name: 'Dashboard', path: '/part-time-connect/dashboard' },
      { name: 'Part Time Portal', path: '/part-time-connect/portal' },
      { name: 'Connect-drive', path: '/part-time-connect/connect-drive' },
    ],
  },
  {
    name: 'Module Test',
    icon: <FaChartBar className="text-white" />,
    subMenu: [
      { name: 'Summary', path: '/summary' },
      { name: 'Detailed Reports', path: '/detailed-reports' },
    ],
  },
  {
    name: 'Settings',
    icon: <FaCog className="text-white" />,
    subMenu: [
      { name: 'Profile', path: '/part-time-connect' },
      { name: 'Account', path: '/account' },
    ],
  },
];

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      {/* First-Level Sidebar (Icons) */}
      <div className="flex w-10 flex-col items-center space-y-4 bg-gray-900 p-2 text-white">
        {menuItems.map(menu => (
          <button
            key={menu.name}
            className="flex w-full flex-col items-center rounded-sm p-3 hover:bg-gray-700"
            onClick={() => {
              setActiveMenu(activeMenu === menu.name ? null : menu.name);
              setCollapsed(false); // Reset collapsed state when switching menus
            }}
          >
            {menu.icon}
          </button>
        ))}
      </div>

      {/* Second-Level Sidebar (Submenu) */}
      {activeMenu && (
        <div
          className={`${collapsed ? 'w-6' : 'sidebar-expanded'} bg-gray-100 p-2 transition-all duration-300`}
        >
          {/* Header Section */}
          <div className="flex items-center">
            <h2 className={`text-base font-semibold ${collapsed ? 'hidden' : 'block'}`}>
              {activeMenu}
            </h2>
            <button onClick={() => setCollapsed(!collapsed)} className="ml-auto">
              {collapsed ? <IoMdArrowDropright size={20} /> : <IoMdArrowDropleft size={20} />}
            </button>
          </div>

          {/* Submenu Items */}
          {!collapsed && (
            <ul className="mt-2">
              {menuItems
                .find(menu => menu.name === activeMenu)
                ?.subMenu.map(subItem => {
                  const isActive = pathname === subItem.path;
                  return (
                    <li key={subItem.name} className="rounded-md">
                      <Link
                        href={subItem.path}
                        className={`block rounded-md p-1 transition ${
                          isActive ? 'bg-green-500 font-medium text-white' : 'hover:bg-gray-300'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
