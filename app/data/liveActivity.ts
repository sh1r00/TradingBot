/**
 * Live Activity Feed — fetches activity data with seed fallback.
 * Simulates real-time activity by periodically generating new entries.
 */
export interface ActivityItem {
  id: string
  message: string
  timestamp: Date
}

const SEED_ACTIVITIES: ActivityItem[] = [
  { id: 'a1', message: 'Someone in New York just explored the resource library', timestamp: new Date(Date.now() - 30000) },
  { id: 'a2', message: 'A new member joined from London', timestamp: new Date(Date.now() - 90000) },
  { id: 'a3', message: 'Resource shared: Top Freelancing Platforms', timestamp: new Date(Date.now() - 180000) },
  { id: 'a4', message: 'Daily check-in streak reached 7 days!', timestamp: new Date(Date.now() - 360000) },
  { id: 'a5', message: 'Free toolkit downloaded: Income Tracker Template', timestamp: new Date(Date.now() - 600000) },
  { id: 'a6', message: 'New achievement earned: Early Access badge', timestamp: new Date(Date.now() - 900000) },
]

const SIMULATED_MESSAGES = [
  'A user signed up from Chicago',
  'Resource viewed: The Complete Guide to Freelancing',
  'Someone shared this page on Twitter',
  'Passive Income Blueprint viewed 50 times today',
  'New member started their 7-day streak challenge',
  'E-Commerce Starter Kit was just downloaded',
  'A user earned the 5 Shares badge',
  'Freelance Rate Calculator used by 200+ people',
]

let messageCounter = 0

/**
 * Fetch live activity data. Falls back to seed data if fetch returns nothing.
 * Simulates network delay (300-800ms).
 */
export async function fetchLiveActivity(): Promise<ActivityItem[]> {
  // Simulate API fetch — in production, replace with real endpoint
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500))

  // For PWA/demo: always return seed data (would be real fetch in production)
  return [...SEED_ACTIVITIES]
}

/**
 * Generate a single simulated activity (for real-time additions).
 */
export function generateActivity(): ActivityItem {
  const msg = SIMULATED_MESSAGES[messageCounter % SIMULATED_MESSAGES.length]
  messageCounter++
  return {
    id: `live_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    message: msg,
    timestamp: new Date(),
  }
}
