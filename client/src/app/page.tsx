import React from 'react';
import Image from 'next/image';
import Logo from '/public/login/Logo.png';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-100">

      <form className="relative w-[640px] h-[480px] bg-white rounded-[25px] flex flex-col items-center justify-center">
        
        <Image
          src={Logo}
          alt="Logo"
          width={125}
          height={125}
          className="flex left-10 top-10 bottom-20 "
        />
        
        <div>
          <div className="left-0 top-0 text-black text-base font-normal font-['Inter']">Username/email</div>
          <input
            type="text"
            className="w-[560px] h-[60px] bg-white rounded-[10px] border border-neutral-200 text-black"
            style={{ paddingLeft: '10px' }}
            placeholder="Username/email"
          />
        </div>

        <div style={{ marginTop: '15px'}}>
          <div className="left-0 top-0 text-black text-base font-normal font-['Inter']">Password</div>
          <input
            type="password"
            className="w-[560px] h-[60px] bg-white rounded-[10px] border border-neutral-200 text-black"
            style={{ paddingLeft: '10px' }}
            placeholder="Password"
          />
        </div>

        <div className="w-[560px] h-[60px] bg-blue-500 rounded-[10px]" style={{ marginTop: '25px'}}>
          <button type="submit" className="w-full h-full text-white">Login</button>
        </div>
      </form>
      
    </main>
  );
}
