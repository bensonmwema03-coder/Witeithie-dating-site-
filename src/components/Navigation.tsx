/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'react-router-dom';
import { Heart, MessageSquare, User, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { href: '/', icon: Heart, label: 'Discover' },
    { href: '/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800 px-6 py-4 flex justify-around items-center rounded-t-[2.5rem] shadow-2xl md:top-0 md:bottom-auto md:flex-col md:w-24 md:h-full md:rounded-r-[2.5rem] md:rounded-tl-none">
      <div className="hidden md:flex items-center justify-center mb-12">
        <span className="text-xl font-black tracking-tighter uppercase text-white">Witeithie.</span>
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              isActive ? "text-rose-500 scale-110" : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "fill-rose-500")} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.label}</span>
            {isActive && (
              <motion.div 
                layoutId="nav-glow"
                className="w-1 h-1 bg-rose-500 rounded-full mt-1 shadow-[0_0_8px_rgba(244,63,94,0.8)]" 
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
