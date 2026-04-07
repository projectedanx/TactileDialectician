import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges and deduplicates Tailwind CSS classes conditionally.
 * Integrates `clsx` for conditional classes and `twMerge` to handle tailwind conflict resolution.
 *
 * @param {...ClassValue[]} inputs - An array of class values, which can be strings, objects, or arrays.
 * @returns {string} A highly optimized, collision-free string of tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
