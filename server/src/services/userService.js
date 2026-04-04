import { querySupabase } from '../db/supabaseClient.js';

/**
 * Fetch all users
 */
export const getAllUsers = async () => {
  try {
    console.log('[UserService] Fetching all users...');
    const result = await querySupabase('users', {
      select: 'id, name, email, phone, created_at, updated_at',
      order: 'created_at.desc',
    });
    console.log(`[UserService] Successfully fetched ${result.length} users`);
    return result;
  } catch (error) {
    console.error('[UserService] Error fetching all users:', error.message);
    throw error;
  }
};

/**
 * Fetch user by ID
 */
export const getUserById = async (id) => {
  try {
    console.log(`[UserService] Fetching user ID: ${id}`);
    const result = await querySupabase('users', {
      select: 'id, name, email, phone, created_at, updated_at',
      filter: { id },
      limit: 1,
    });
    const user = result[0] || null;
    console.log(`[UserService] ${user ? 'Found' : 'Not found'} user with ID ${id}`);
    return user;
  } catch (error) {
    console.error(`[UserService] Error fetching user by ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Fetch user by email
 */
export const getUserByEmail = async (email) => {
  try {
    console.log(`[UserService] Fetching user with email: ${email}`);
    const result = await querySupabase('users', {
      select: 'id, name, email, phone, created_at, updated_at',
      filter: { email },
      limit: 1,
    });
    const user = result[0] || null;
    console.log(`[UserService] ${user ? 'Found' : 'Not found'} user with email ${email}`);
    return user;
  } catch (error) {
    console.error(`[UserService] Error fetching user by email:`, error.message);
    throw error;
  }
};
