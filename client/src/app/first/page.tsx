'use client'

import React, { useState } from 'react';

export default function Form() {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const newErrors: {[key: string]: string} = {};

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password and Confirm Password do not match';
    }

    if (!fullName) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!address) {
      newErrors.address = 'Address is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = 'Phone Number is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // You can perform form submission or other actions here
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-100">
      <div
        className="text-black text-[50px] font-bold font-['Inter']"
        style={{ marginRight: '650px', marginTop: '40px' }}
      >
        Update Data
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-[960px] min-h-[800px] bg-white rounded-[25px] flex flex-col items-left"
        style={{ marginTop: '20px', marginBottom: '40px', paddingBottom: '40px' }}
      >
        <div>
          <div
            className="left-0 top-0 text-black text-base font-normal font-['Inter']"
            style={{ marginLeft: '40px', marginTop: '40px' }}
          >
            Password Baru
          </div>
          <input
            type="password"
            className="w-[880px] h-[60px] bg-white rounded-[10px] border border-neutral-200 text-black"
            style={{ paddingLeft: '10px', marginLeft: '40px', marginTop: '8px' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className="text-red-400" style={{ marginLeft: '40px', fontSize: '12px'}}>{errors.password}</div>}
        </div>

        <div>
          <div
            className="left-0 top-0 text-black text-base font-normal font-['Inter']"
            style={{ marginLeft: '40px', marginTop: '30px' }}
          >
            Konfirmasi Password
          </div>
          <input
            type="password"
            className="w-[880px] h-[60px] bg-white rounded-[10px] border border-neutral-200 text-black"
            style={{ paddingLeft: '10px', marginLeft: '40px', marginTop: '8px' }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <div className="text-red-400" style={{ marginLeft: '40px', fontSize: '12px'}}>{errors.confirmPassword}</div>}
        </div>

        <div>
          <div
            className="left-0 top-0 text-black text-base font-normal font-['Inter']"
            style={{ marginLeft: '40px', marginTop: '30px' }}
          >
            Nama Lengkap
          </div>
          <input
            type="text"
            className="w-[880px] h-[60px] bg-white rounded-[10px] border border-neutral-200 text-black"
            style={{ paddingLeft: '10px', marginLeft: '40px', marginTop: '8px' }}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && <div className="text-red-400" style={{ marginLeft: '40px', fontSize: '12px'}}>{errors.fullName}</div>}
        </div>

        <div>
          <div
            className="left-0 top-0 text-black text-base font-normal font-['Inter']"
            style={{ marginLeft: '40px', marginTop: '30px' }}
          >
            Alamat
          </div>
          <input
            type="text"
            className="w-[880px] h-[60px] bg-white rounded-[10px] border border-neutral-200 text-black"
            style={{ paddingLeft: '10px', marginLeft: '40px', marginTop: '8px' }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && <div className="text-red-400" style={{ marginLeft: '40px', fontSize: '12px'}}>{errors.address}</div>}
        </div>

        <div>
          <div
            className="left-0 top-0 text-black text-base font-normal font-['Inter']"
            style={{ marginLeft: '40px', marginTop: '30px' }}
          >
            E-mail
          </div>
          <input
            type="email"
            className="w-[880px] h-[60px] bg-white rounded-[10px] border border-neutral-200 text-black"
            style={{ paddingLeft: '10px', marginLeft: '40px', marginTop: '8px' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="text-red-400" style={{ marginLeft: '40px', fontSize: '12px'}}>{errors.email}</div>}
        </div>

        <div>
          <div
            className="left-0 top-0 text-black text-base font-normal font-['Inter']"
            style={{ marginLeft: '40px', marginTop: '30px' }}
          >
            No. Telephone
          </div>
          <input
            type="text"
            className="w-[880px] h-[60px] bg-white rounded-[10px] border border-neutral-200 text-black"
            style={{ paddingLeft: '10px', marginLeft: '40px', marginTop: '8px' }}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && <div className="text-red-400" style={{ marginLeft: '40px', fontSize: '12px'}}>{errors.phoneNumber}</div>}
        </div>

        <button
          type="submit"
          className="w-[100px] h-[40px] bg-blue-500 text-white rounded-md mt-4 hover:bg-blue-700 transition duration-300 ease-in-out"
          style={{ marginTop: '20px', marginLeft: '820px' }}
        >
          Simpan
        </button>
      </form>
    </main>
  );
}
