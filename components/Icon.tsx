/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React from 'react';
import {AppDefinition} from '../types';

interface IconProps {
  app: AppDefinition;
  onInteract: () => void;
  iconSize?: 'sm' | 'md' | 'lg';
}

export const Icon: React.FC<IconProps> = ({app, onInteract, iconSize = 'md'}) => {
  const containerSize = iconSize === 'sm' ? 'w-24 h-28' : iconSize === 'lg' ? 'w-32 h-36' : 'w-28 h-32';
  const glyphSize = iconSize === 'sm' ? 'text-5xl' : iconSize === 'lg' ? 'text-7xl' : 'text-6xl';
  return (
    <div
      className={`${containerSize} flex flex-col items-center justify-center text-center m-3 p-3 cursor-pointer select-none rounded-2xl transition-all duration-300 hover:bg-white/60 active:bg-white/70 focus:bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 icon-hover-glow backdrop-blur-sm`}
      onClick={onInteract}
      onKeyDown={(e) => e.key === 'Enter' && onInteract()}
      tabIndex={0}
      role="button"
      aria-label={`Open ${app.name}`}
      style={{
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
      }}>
      <div className={`${glyphSize} mb-2 icon-image`}>{app.icon}</div>
      <div className="text-sm text-gray-900 font-semibold break-words max-w-full leading-tight tracking-tight drop-shadow-sm">
        {app.name}
      </div>
    </div>
  );
};
