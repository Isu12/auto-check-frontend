
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Adjust this import as per your setup
import { ArrowLeft, ArrowRight, House, Car, Phone, Cog, LayoutDashboard} from "lucide-react"; // Import the icons from Lucide
import styles from "./side-nav.module.css"; // Import the updated CSS Module

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Start with sidebar partially open

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn(styles.sidebar, isOpen ? styles.open : styles.closed)}>
      <button onClick={toggleSidebar} className={styles.sidebarToggle}>
        {isOpen ? <ArrowLeft /> : <ArrowRight />} {/* Use Lucide icons for toggle */}
      </button>

      <nav className={styles.sidebarNav}>
        <ul>
          <li>
            <Link href="/" className={styles.sidebarItem}>
              <span className={styles.icon}><House size={28} /></span> {/* Only show icon initially */}
              {isOpen && <span className={styles.itemName}>Home</span>} {/* Show name when expanded */}
            </Link>
          </li>
          <li>
            <Link href="/contact" className={styles.sidebarItem}>
              <span className={styles.icon}><LayoutDashboard size={28} /></span> {/* Only show icon initially */}
              {isOpen && <span className={styles.itemName}>Dashboard</span>} {/* Show name when expanded */}
            </Link>
          </li>
          <li>
            <Link href="/about" className={styles.sidebarItem}>
              <span className={styles.icon}><Car size={28} /></span> {/* Only show icon initially */}
              {isOpen && <span className={styles.itemName}>Vehicles</span>} {/* Show name when expanded */}
            </Link>
          </li>
          <li>
            <Link href="/services" className={styles.sidebarItem}>
              <span className={styles.icon}><Cog size={28} /></span> {/* Only show icon initially */}
              {isOpen && <span className={styles.itemName}>Service Centers</span>} {/* Show name when expanded */}
            </Link>
          </li>
          <li>
            <Link href="/contact" className={styles.sidebarItem}>
              <span className={styles.icon}><Phone size={28} /></span> {/* Only show icon initially */}
              {isOpen && <span className={styles.itemName}>Contact</span>} {/* Show name when expanded */}
            </Link>
          </li>


          
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
