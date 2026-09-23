import React from 'react';

interface AdminLoadingStateProps {
  message?: string;
}

export const AdminLoadingState: React.FC<AdminLoadingStateProps> = ({
  message = 'Loading administrative data...',
}) => {
  return (
    <div className="py-16 text-center space-y-3">
      <div className="w-8 h-8 border-2 border-[#C9892E] border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="font-mono text-xs uppercase tracking-wider text-[#8C8075]">
        {message}
      </p>
    </div>
  );
};
