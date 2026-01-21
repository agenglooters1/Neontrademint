import { supabase } from './supabase';

export async function createOrGetUser(phone: string) {
  // check user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single();

  if (existingUser) {
    return existingUser;
  }

  // create new user
  const { data: newUser, error } = await supabase
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

  if (error) throw error;
  return newUser;
}
