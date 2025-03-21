'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../../Components/ui/button';
import { Separator } from '../../Components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaMicrosoft } from 'react-icons/fa';

export function SocialAuth() {
  const router = useRouter();

  const handleSocialAuth = (provider: string) => {
    router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/social-auth/${provider}/url`);
  };

  return (
    <div className="mt-6">
      <div className="relative flex w-full items-center justify-center gap-4">
        <div className="w-[100px]">
          <Separator />
        </div>
        <span className="flex-shrink-0 text-xs uppercase text-muted-foreground">
          Or continue with
        </span>
        <div className="w-[100px]">
          <Separator />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          className="hover:bg-emerald-50 hover:text-emerald-600"
          onClick={() => handleSocialAuth('google')}
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button
          variant="outline"
          className="hover:bg-emerald-50 hover:text-emerald-600"
          onClick={() => handleSocialAuth('facebook')}
        >
          <FaFacebook className="mr-2 h-4 w-4 text-blue-600" />
          Facebook
        </Button>
        <Button
          variant="outline"
          className="hover:bg-emerald-50 hover:text-emerald-600"
          onClick={() => handleSocialAuth('microsoft')}
        >
          <FaMicrosoft className="mr-2 h-4 w-4 text-[#00A4EF]" />
          Microsoft
        </Button>
      </div>
    </div>
  );
}
