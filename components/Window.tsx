/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, { useState, useRef, useEffect, useCallback } from 'react';

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const resizeStartDim = useRef({ width: 0, height: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Initialize position to center
  useEffect(() => {
    if (!position && windowRef.current) {
      const { clientWidth, clientHeight } = document.documentElement;
      const { offsetWidth, offsetHeight } = windowRef.current;
      setPosition({
        x: (clientWidth - offsetWidth) / 2,
        y: (clientHeight - offsetHeight) / 2,
      });
    }
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging if clicking the title bar, not buttons on it
    if ((e.target as HTMLElement).closest('.minimize-btn')) return;

    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - (position?.x || 0),
      y: e.clientY - (position?.y || 0),
    };
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
    resizeStartDim.current = { width: size.width, height: size.height };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      let newX = e.clientX - dragStartPos.current.x;
      let newY = e.clientY - dragStartPos.current.y;

      // Limit to viewport
      if (windowRef.current) {
        const { clientWidth, clientHeight } = document.documentElement;
        const { offsetWidth, offsetHeight } = windowRef.current;

        newX = Math.max(0, Math.min(newX, clientWidth - offsetWidth));
        newY = Math.max(0, Math.min(newY, clientHeight - offsetHeight));
      }

      setPosition({ x: newX, y: newY });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStartPos.current.x;
      const deltaY = e.clientY - resizeStartPos.current.y;

      let newWidth = Math.max(400, resizeStartDim.current.width + deltaX);
      let newHeight = Math.max(300, resizeStartDim.current.height + deltaY);

      // Limit to viewport
      if (position) {
        const { clientWidth, clientHeight } = document.documentElement;
        newWidth = Math.min(newWidth, clientWidth - position.x);
        newHeight = Math.min(newHeight, clientHeight - position.y);
      }

      setSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, position]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={windowRef}
      className="window-surface bg-white/95 border border-white/40 rounded-3xl flex flex-col absolute overflow-hidden font-sans backdrop-blur-xl"
      style={{
        left: position ? `${position.x}px` : '50%',
        top: position ? `${position.y}px` : '50%',
        transform: position ? 'none' : 'translate(-50%, -50%)',
        width: `${size.width}px`,
        height: isMinimized ? 'auto' : `${size.height}px`,
        zIndex: 50,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 1px 2px rgba(255, 255, 255, 0.4) inset',
      }}
    >
      {/* Title Bar with enhanced gradient and depth */}
      <div
        className="text-white py-2.5 px-4 font-semibold text-base flex justify-between items-center select-none cursor-move rounded-t-3xl flex-shrink-0"
        style={{
          background: 'linear-gradient(180deg, #4b5563 0%, #3b4250 60%, #2f3542 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.15)',
        }}
        onMouseDown={handleMouseDown}
      >
        <span className="title-bar-text tracking-wide">{title}</span>
        <button
          className="minimize-btn hover:bg-white/20 rounded p-1 transition-colors flex items-center justify-center w-8 h-8"
          onClick={() => setIsMinimized(!isMinimized)}
          title={isMinimized ? "Expand" : "Minimize"}
        >
          {isMinimized ? (
            <span role="img" aria-label="expand">◻️</span>
          ) : (
            <span role="img" aria-label="minimize">−</span>
          )}
        </button>
      </div>

      {!isMinimized && (
        <>
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

          {/* Resize handle */}
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center group"
            onMouseDown={handleResizeMouseDown}
          >
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full opacity-40 group-hover:opacity-100 transition-opacity translate-x-1 translate-y-1"></div>
          </div>
        </>
      )}
    </div>
  );
};
