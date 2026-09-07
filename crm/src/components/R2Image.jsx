import React, { useState, useEffect } from "react";
import { getR2FileUrl } from "utils/r2Storage";

export default function R2Image({ fileKey, alt, className, fallback }) {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUrl = async () => {
      if (!fileKey) return;
      // If it's already a full HTTP URL (like from legacy supabase storage), just use it
      if (fileKey.startsWith('http')) {
        setUrl(fileKey);
        return;
      }
      
      try {
        const signedUrl = await getR2FileUrl(fileKey);
        if (isMounted) setUrl(signedUrl);
      } catch (err) {
        console.error("Failed to load R2 image:", err);
        if (isMounted) setError(true);
      }
    };
    fetchUrl();
    return () => { isMounted = false; };
  }, [fileKey]);

  if (error || (!url && !fileKey)) {
    return fallback || <div className={`bg-gray-200 flex items-center justify-center text-gray-400 ${className}`}>Failed</div>;
  }

  if (!url) {
    return <div className={`bg-gray-100 animate-pulse ${className}`} />;
  }

  return <img src={url} alt={alt} className={className} />;
}
