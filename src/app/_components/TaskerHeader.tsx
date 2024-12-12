import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

const TaskerHeader = () => {
  return (
    <div className='p-5 shadow-sm flex justify-between'>
      <div className='flex items-center gap-8'>
        <Link href={'/'}>
          <Image src="/logo.png" alt="logo" width={180} height={100} />
        </Link>
        <div className='md:flex items-center gap-6 hidden'>
          <Link href={'/tasker'}>
            <h2 className='hover:scale-105 hover:text-primary cursor-pointer'>My Business</h2>
          </Link>
          <Link href={'/taskerViewOrder'}>
            <h2 className='hover:scale-105 hover:text-primary cursor-pointer'>My Orders</h2>
          </Link>
          <Link href={'/taskerAddService'}>
            <h2 className='hover:scale-105 hover:text-primary cursor-pointer'>Add Service</h2>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/">
          <button className="border border-primary px-4 py-2 rounded-lg text-primary hover:bg-primary hover:text-white transition-all">
            Switch to Customer
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TaskerHeader;
