// src/pages/index.tsx को completely replace करें
import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>MMN Store</title>
      </Head>
      
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>MMN Store is Working!</h1>
        <p>Your app is successfully deployed.</p>
      </div>
    </div>
  );
}
