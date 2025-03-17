"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import ServiceRecordGrid from "../Components/ServiceRecordTable";
import { ToastProvider } from '@radix-ui/react-toast';
import { ToastViewport, Toast } from '../../../components/ui/toast';

export default function Home() {
  return (
    <div>

      <ServiceRecordGrid />
      </div>
  );
}
