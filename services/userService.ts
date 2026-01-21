import { supabase } from './supabase';

export interface AppUser {
  id: number;
  phone: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
}

export async function createOrGetUser(phone: string): Promise<AppUser> {
  // 1️⃣ Check if user already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single();

  if (existingUser) {
    return existingUser;
  }

  // 2️⃣ If not exists → create new user
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert([
      {
        phone,
        role: 'user',
        is_active: true,
      },
    ])
    .select()
    .single();

  if (insertError) {
    throw insertError;
  }

  return newUser;
}
