/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const MOCK_MESSAGES = [
  {
    id: '1',
    name: 'Sarah',
    lastMessage: 'That coffee shop sounded great!',
    time: '2m ago',
    unread: true,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    active: true
  },
  {
    id: '2',
    name: 'Marcus',
    lastMessage: 'Are you free on Thursday?',
    time: '1h ago',
    unread: false,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    active: false
  },
  {
    id: '3',
    name: 'Lila',
    lastMessage: 'The exhibition was stunning.',
    time: '5h ago',
    unread: false,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    active: false
  }
];

export default function Messages() {
  return (
    <div className="h-[85vh] flex flex-col pt-4 overflow-hidden">
      <header className="mb-8 relative">
        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Messages</h1>
        <div className="w-12 h-1.5 bg-rose-500 mt-4" />
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input 
          placeholder="SEARCH MATCHES..." 
          className="pl-12 py-6 rounded-2xl border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 font-black uppercase tracking-widest text-[10px]"
        />
      </div>

      <div className="mb-10">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black mb-6 px-1">New Matches</h3>
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3 shrink-0">
              <div className="w-20 h-20 rounded-full border-2 border-rose-500/30 p-1 relative group cursor-pointer hover:border-rose-500 transition-colors">
                <Avatar className="w-full h-full border-2 border-zinc-900">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${i + 15}`} className="grayscale-[0.5] hover:grayscale-0 transition-all" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight text-zinc-400">User {i}</span>
            </div>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black">Recent Conversations</h3>
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2 py-1 rounded">10 CREDITS / CHAT</span>
          </div>
          {MOCK_MESSAGES.map((chat) => (
            <div key={chat.id} className="flex items-center gap-5 group cursor-pointer active:scale-95 transition-all p-4 rounded-3xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-zinc-800 shadow-xl group-hover:border-rose-500/50 transition-colors">
                  <AvatarImage src={chat.image} className="grayscale-[0.3]" />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                {chat.active && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-black text-xl tracking-tighter uppercase leading-none text-white">{chat.name}</h4>
                  <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className={`text-[13px] line-clamp-1 font-medium ${chat.unread ? 'text-rose-400' : 'text-zinc-500'}`}>
                    {chat.lastMessage}
                  </p>
                  {chat.unread && (
                    <div className="h-2 w-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
