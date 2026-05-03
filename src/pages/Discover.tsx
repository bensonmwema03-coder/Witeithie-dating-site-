/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Heart, X, Info, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db, auth, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const MOCK_PROFILES = [
  {
    id: '1',
    name: 'Eleanor',
    age: 26,
    bio: 'Art historian and weekend gardener. Looking for someone to explore local galleries with.',
    distance: '1.2 miles away',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop',
    interests: ['Art', 'Gardening', 'Coffee']
  },
  {
    id: '2',
    name: 'Julian',
    age: 29,
    bio: 'Architect. Passionate about sustainable design and making the perfect sourdough.',
    distance: '3.5 miles away',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop',
    interests: ['Design', 'Cooking', 'Hiking']
  },
  {
    id: '3',
    name: 'Maya',
    age: 24,
    bio: 'Software engineer by day, jazz pianist by night. Let\'s go to a concert soon!',
    distance: '0.8 miles away',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop',
    interests: ['Music', 'Tech', 'Wine']
  }
];

export default function Discover() {
  const [profiles, setProfiles] = useState(MOCK_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeProfile = profiles[currentIndex];

  const handleSwipe = async (type: 'like' | 'pass') => {
    if (!activeProfile || !auth.currentUser) return;

    const interactionData = {
      fromId: auth.currentUser.uid,
      toId: activeProfile.id,
      type,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'interactions'), interactionData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'interactions');
    }

    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setProfiles([]); 
    }
  };

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-8 relative overflow-hidden">
        <h1 className="text-[140px] font-black leading-[0.85] tracking-tighter uppercase select-none opacity-5 absolute -top-8 -left-2 text-white">
           END.
        </h1>
        <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-rose-500 animate-pulse" />
        </div>
        <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">Nobody Left!</h2>
        <p className="text-zinc-500 max-w-xs font-medium">You've explored everyone in this radius. Expand your search area?</p>
        <Button 
          variant="outline" 
          className="mt-8 rounded-full border-white/20 text-white hover:bg-white hover:text-black font-black uppercase tracking-widest px-8 py-6"
          onClick={() => {
            setProfiles(MOCK_PROFILES);
            setCurrentIndex(0);
          }}
        >
          Reset List
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-[85vh] flex flex-col pt-4 overflow-hidden">
      <header className="mb-6 relative z-10">
        <div className="relative">
          <h1 className="text-[100px] font-black leading-[0.75] tracking-tighter uppercase select-none opacity-10 absolute -top-12 -left-4 text-white">
            Witeithie.
          </h1>
          <div className="relative pt-6">
            <p className="text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2 px-1">Available in your area</p>
            <h2 className="text-5xl font-black tracking-tight uppercase leading-none">
              {profiles.length - currentIndex} <span className="text-white/20 italic font-light lowercase tracking-normal">nearby</span>
            </h2>
          </div>
        </div>
      </header>

      <div className="flex-1 relative mt-8">
        <AnimatePresence mode="popLayout">
          <CardWithSwipe
            key={activeProfile.id}
            profile={activeProfile}
            onSwipeLeft={() => handleSwipe('pass')}
            onSwipeRight={() => handleSwipe('like')}
          />
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-6 mt-10 mb-8 relative z-10">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-20 h-20 border-zinc-800 bg-zinc-900 shadow-2xl hover:bg-rose-500 hover:border-rose-500 text-white transition-all duration-300 active:scale-90"
          onClick={() => handleSwipe('pass')}
        >
          <X className="w-10 h-10" />
        </Button>
        <Button
          size="lg"
          className="rounded-full w-20 h-20 bg-rose-600 hover:bg-rose-500 shadow-[0_0_40px_rgba(225,29,72,0.3)] transition-all duration-300 active:scale-95"
          onClick={() => handleSwipe('like')}
        >
          <Heart className="w-10 h-10 fill-white" />
        </Button>
      </div>
    </div>
  );
}

function CardWithSwipe({ profile, onSwipeLeft, onSwipeRight }: any) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipeRight();
    } else if (info.offset.x < -100) {
      onSwipeLeft();
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
    >
      <Card className="w-full h-full overflow-hidden border border-zinc-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative bg-zinc-900 rounded-[3rem]">
        <div className="h-2/3 bg-zinc-800 relative overflow-hidden">
          <img
            src={profile.image}
            alt={profile.name}
            className="w-full h-full object-cover pointer-events-none brightness-90 grayscale-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
        </div>
        
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-10 border-[6px] border-emerald-500 text-emerald-500 font-black text-5xl px-6 py-2 rounded-2xl rotate-[-20deg] uppercase z-20">
          Like
        </motion.div>
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-10 right-10 border-[6px] border-rose-500 text-rose-500 font-black text-5xl px-6 py-2 rounded-2xl rotate-[20deg] uppercase z-20">
          Nope
        </motion.div>

        <div className="p-8 flex flex-col justify-end -mt-24 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-rose-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">98% Match</span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">
              {profile.name}, {profile.age}
            </h3>
          </div>
          
          <p className="text-zinc-500 text-sm mt-2 italic font-medium flex items-center gap-1">
             Upper Manhattan • {profile.distance}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {profile.interests.map((interest: string) => (
              <span key={interest} className="px-3 py-1 bg-zinc-800 rounded-md text-[10px] font-black text-zinc-300 uppercase tracking-widest border border-zinc-700">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
