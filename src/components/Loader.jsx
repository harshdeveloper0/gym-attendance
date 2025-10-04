// components/Loader.jsx
'use client'
import React from 'react';
import { ClipLoader } from 'react-spinners'; // ek spinner import kiya

const Loader = ({ loading = true, size = 50, color = "#36d7b7" }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ClipLoader
        color={color}
        loading={loading}
        size={size}
      />
    </div>
  );
};

export default Loader;
