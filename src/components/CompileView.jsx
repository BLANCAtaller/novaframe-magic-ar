'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Compiler } from 'mind-ar/dist/mindar-image.prod.js';

export default function CompileView() {
  const [status, setStatus] = useState('Loading image...');
  const imgRef = useRef(null);

  useEffect(() => {
    const compile = async () => {
      try {
        if (!imgRef.current) return;
        setStatus('Compiling...');
        const compiler = new Compiler();
        
        const image = new Image();
        image.src = '/images/products/lego-alice/color/lego-alice-v1.webp';
        await new Promise((resolve) => {
          image.onload = resolve;
        });

        await compiler.compileImageTargets([image], (progress) => {
          setStatus(`Compiling: ${progress.toFixed(2)}%`);
        });

        const exportedBuffer = await compiler.exportData();
        const response = await fetch('/api/save-mind', {
          method: 'POST',
          body: exportedBuffer,
        });
        const result = await response.json();
        if (result.success) {
          setStatus('Saved alice.mind successfully!');
        } else {
          setStatus('Failed to save alice.mind');
        }
      } catch (err) {
        setStatus(`Error: ${err.message}`);
        console.error(err);
      }
    };
    compile();
  }, []);

  return (
    <div style={{ color: 'white', padding: '50px' }}>
      <h1>{status}</h1>
      <img ref={imgRef} src="/images/products/lego-alice/color/lego-alice-v1.webp" style={{ width: '300px', display: 'none' }} />
    </div>
  );
}
