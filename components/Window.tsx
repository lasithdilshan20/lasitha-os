/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React from 'react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void; // This prop remains, though its direct trigger (the X button) is removed.
  isAppOpen: boolean;
  appId?: string | null;
  onToggleParameters: () => void;
  onExitToDesktop: () => void;
  isParametersPanelOpen?: boolean;
}

const MenuItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({children, onClick, className}) => (
  <span
    className={`menu-item cursor-pointer px-2 py-1 rounded-md transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 ${className}`}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onClick?.();
    }}
    tabIndex={0}
    role="button">
    {children}
  </span>
);

export const Window: React.FC<WindowProps> = ({
  title,
  children,
  onClose,
  isAppOpen,
  onToggleParameters,
  onExitToDesktop,
  isParametersPanelOpen,
}) => {
  return (
    <div className="window-surface w-[800px] h-[600px] bg-white/95 border border-white/40 rounded-3xl flex flex-col relative overflow-hidden font-sans backdrop-blur-xl"
         style={{
           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 1px 2px rgba(255, 255, 255, 0.4) inset',
         }}>
      {/* Title Bar with enhanced gradient and depth */}
      <div className="text-white py-2.5 px-4 font-semibold text-base flex justify-between items-center select-none cursor-default rounded-t-3xl flex-shrink-0"
           style={{
             background: 'linear-gradient(180deg, #4b5563 0%, #3b4250 60%, #2f3542 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.15)',
           }}>
        <span className="title-bar-text tracking-wide">{title}</span>
        {/* "X" button removed from here */}
      </div>

      {/* Menu Bar with refined styling */}
      <div className="menu-bar bg-gradient-to-b from-gray-50/95 to-white/90 py-2 px-3 border-b border-gray-200/60 select-none flex gap-2 flex-shrink-0 text-sm text-gray-700 items-center backdrop-blur-sm"
           style={{boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'}}>
        {!isParametersPanelOpen && (
          <MenuItem onClick={onToggleParameters}>
            <span role='img' aria-label='gear'>⚙️</span> Settings
          </MenuItem>
        )}
        {isAppOpen && (
          <MenuItem onClick={onExitToDesktop} className="ml-auto">
            Exit to Desktop
          </MenuItem>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto">{children}</div>
    </div>
  );
};
