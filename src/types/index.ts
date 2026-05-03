/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string;
  displayName: string;
  bio: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  interests: string[];
  photos: string[];
  location?: {
    latitude: number;
    longitude: number;
    lastUpdated: number;
  };
  createdAt: number;
  updatedAt: number;
  onboarded: boolean;
  tokens: number;
  subscriptionStatus: 'active' | 'inactive';
  subscriptionExpiry?: number;
}

export interface Match {
  id: string;
  users: string[]; // [uid1, uid2]
  lastMessage?: string;
  lastMessageTime?: number;
  createdAt: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  createdAt: number;
  read: boolean;
}

export interface Interaction {
  id: string;
  fromId: string;
  toId: string;
  type: 'like' | 'pass';
  createdAt: number;
}
