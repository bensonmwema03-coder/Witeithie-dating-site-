/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Settings, Edit3, Shield, Info, LogOut, ChevronRight, Camera, Smartphone, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/src/lib/firebase';
import { useAuth } from '@/src/contexts/AuthContext';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function Profile() {
  const { user } = useAuth();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const handlePayment = async () => {
    if (!phoneNumber || !user) return;
    
    setIsPaying(true);
    setPaymentStatus('pending');
    
    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          amount: 50,
          userId: user.uid,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPaymentStatus('success');
        // Safaricom will send callback to our server
        // In a real app, we'd poll or wait for a push notification/websocket update
      } else {
        setPaymentStatus('error');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen pt-4 pb-12 overflow-hidden">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Profile</h1>
        <Button variant="ghost" size="icon" className="rounded-full text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10">
          <Settings className="w-6 h-6" />
        </Button>
      </header>

      <div className="flex flex-col items-center mb-12 relative">
        <div className="relative mb-6 group cursor-pointer">
          <div className="absolute inset-0 bg-rose-500 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform opacity-20" />
          <Avatar className="w-40 h-40 border-4 border-zinc-900 shadow-2xl relative z-10 rounded-[2.5rem]">
            <AvatarImage src={user?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop"} className="grayscale-[0.3] hover:grayscale-0 transition-all" />
            <AvatarFallback>{user?.displayName?.[0] || '?'}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-3 rounded-2xl border-4 border-zinc-950 shadow-xl group-hover:scale-110 transition-transform z-20">
            <Camera className="w-5 h-5" />
          </div>
        </div>
        <h2 className="text-4xl font-black tracking-tighter uppercase mb-1">{user?.displayName || 'Adventurer'}</h2>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="border-rose-500/50 text-rose-500 font-black px-3 py-1 bg-rose-500/5">
            150 CREDITS
          </Badge>
          <p className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.2em]">Verified Profile • Witeithie</p>
        </div>
        
        <div className="flex gap-4 mt-6">
          <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900 text-white font-black uppercase tracking-widest text-[10px] px-6 py-5 hover:bg-white hover:text-black transition-all">
            <Edit3 className="w-4 h-4 mr-2 text-rose-500" /> Edit Profile
          </Button>
          <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-900 text-white font-black uppercase tracking-widest text-[10px] px-6 py-5 hover:bg-white hover:text-black transition-all">
            <Heart className="w-4 h-4 mr-2 text-rose-500" /> Buy Credits
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <ProfileMenuItem icon={Shield} label="Privacy Controls" />
        <ProfileMenuItem icon={Info} label="Safety Center" />
        <ProfileMenuItem icon={Settings} label="Discovery Radar" />
        <Separator className="my-6 bg-zinc-900" />
        <ProfileMenuItem 
          icon={LogOut} 
          label="Sign Out Access" 
          className="text-rose-500 hover:bg-rose-500/10" 
          onClick={() => auth.signOut()}
        />
      </div>

      <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 text-left relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-rose-500/20 transition-all" />
        <Badge className="bg-rose-500 text-[10px] font-black uppercase tracking-widest mb-4 px-3">Elite Access</Badge>
        <h3 className="font-black text-3xl tracking-tighter uppercase mb-3 leading-none italic">Witeithie Premium</h3>
        <p className="text-sm text-zinc-500 mb-8 font-medium italic">50 KSh / Week. Unlimited swipes, zero ads, and see who liked you instantly.</p>
        <Button 
          onClick={() => setIsPaymentOpen(true)}
          className="w-full rounded-2xl bg-white text-black hover:bg-rose-500 hover:text-white py-8 text-xl font-black uppercase tracking-tighter transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]"
        >
          Pay 50 KSh Now
        </Button>
      </div>

      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">M-Pesa Checkout</DialogTitle>
            <DialogDescription className="text-zinc-500 italic">
              Enter your M-Pesa phone number to receive the STK push notification.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                placeholder="07XX XXX XXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-12 py-7 rounded-2xl border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-700 font-bold text-lg"
              />
            </div>
            {paymentStatus === 'success' && (
              <p className="mt-4 text-emerald-500 text-sm font-bold animate-pulse">
                Request sent! Please check your phone for the M-Pesa PIN prompt.
              </p>
            )}
            {paymentStatus === 'error' && (
              <p className="mt-4 text-rose-500 text-sm font-bold">
                Failed to initiate payment. Please try again.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handlePayment}
              disabled={isPaying || !phoneNumber}
              className="w-full py-7 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-sm transition-all"
            >
              {isPaying ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProfileMenuItem({ icon: Icon, label, className, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all hover:bg-zinc-900 border border-transparent hover:border-zinc-800 group ${className}`}
    >
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform shadow-xl">
          <Icon className="w-6 h-6" />
        </div>
        <span className="font-black uppercase tracking-tighter text-lg">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
    </button>
  );
}
