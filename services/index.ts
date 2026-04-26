import * as mockService from './mockService';
import * as supabaseService from './supabaseService';

// To switch to a real database in the future, simply change this export to supabaseService:
export const api = supabaseService;
