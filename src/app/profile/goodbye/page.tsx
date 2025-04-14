
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";


export default function GoodbyePage() {


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 text-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Account Deleted Successfully</h1>
        
        <p className="text-gray-600">
          We're sorry to see you go. Your account and all associated data have been permanently deleted.
        </p>
        
        <p className="text-gray-500 text-sm">
          Thank you for being part of our community. We hope to see you again in the future.
        </p>

        <div className="pt-4 space-y-4">

          
          <p className="text-gray-400 text-xs">
            You will be automatically redirected in 10 seconds...
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Have feedback? We'd love to hear from you.</p>
        <a 
          href="mailto:support@example.com" 
          className="text-blue-500 hover:underline"
        >
          support@example.com
        </a>
      </div>
    </div>
  );
}