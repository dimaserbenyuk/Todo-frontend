import * as React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function Avatar({ src, alt, className }: AvatarProps) {
  return (
    <div className={`relative w-24 h-24 rounded-full overflow-hidden border ${className}`}>
      {src ? <AvatarImage src={src} alt={alt} /> : <AvatarFallback alt={alt} />}
    </div>
  );
}

export function AvatarImage({ src, alt }: { src: string; alt?: string }) {
  return <img className="w-full h-full object-cover" src={src} alt={alt || "Avatar"} />;
}

export function AvatarFallback({ alt }: { alt?: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700 text-lg font-bold">
      {alt && alt.length > 0 ? alt.charAt(0).toUpperCase() : "?"}
    </div>
  );
}
