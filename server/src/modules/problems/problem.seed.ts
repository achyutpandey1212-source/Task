import { ProblemModel } from './problem.model.js';

export const SEED_PROBLEMS = [
  {
    slug: 'parking-lot',
    title: 'Parking Lot System',
    difficulty: 'medium' as const,
    description:
      'Design an automated multi-floor parking lot management system that handles vehicle ticketing, spot allocation across various vehicle types, and payment calculations upon exit.',
    requirements: [
      'Support multiple floors, each with multiple parking spots categorized by size (Motorcycle, Compact, Large).',
      'Accommodate distinct vehicle types (Motorcycles, Cars, Buses/Trucks) and place them only into compatible spots.',
      'Provide automated entry ticketing with entry timestamp and assigned spot information.',
      'Track real-time occupancy and display availability per floor and spot category.',
      'Calculate parking fees upon exit based on vehicle type and duration parked with dynamic or flat hourly pricing strategies.',
      'Support cash and card payment processing and release spot upon successful payment.',
    ],
    constraints: [
      'A bus requires large spots or multiple contiguous large spots.',
      'System must operate correctly during concurrent entry and exit operations without double-allocating spots.',
    ],
  },
  {
    slug: 'library-management-system',
    title: 'Library Management System',
    difficulty: 'easy' as const,
    description:
      'Design a library information and circulation management system for cataloging books, managing member accounts, checking out items, and assessing overdue fines.',
    requirements: [
      'Catalog book items identified by unique barcode or ISBN, with support for multiple physical copies of a single title.',
      'Support two member types: Regular Members and Librarians.',
      'Allow members to search for books by title, author, subject, or publication date.',
      'Enable members to check out up to a configurable maximum number of books (e.g., 5 books for up to 14 days).',
      'Handle book reservations when all copies of a title are currently loaned out.',
      'Calculate and collect overdue fines when a book is returned past the due date.',
      'Allow librarians to add, update, and decommission book copies in the catalog.',
    ],
    constraints: [
      'Members with unpaid fines exceeding a threshold cannot borrow additional books.',
      'Reservation priority queue follows first-come-first-served policy.',
    ],
  },
  {
    slug: 'elevator-system',
    title: 'Elevator Control System',
    difficulty: 'medium' as const,
    description:
      'Design a multi-elevator dispatching and control system for a high-rise building that coordinates car movement, processes floor requests, and minimizes passenger wait times.',
    requirements: [
      'Manage multiple elevator cars operating across N floors.',
      'Support internal car requests (passenger selects target destination floor) and external hall calls (passenger presses Up or Down on a floor).',
      'Model elevator states: Idle, Moving Up, Moving Down, Maintenance, and Door Opening/Closing.',
      'Implement an extensible dispatching algorithm (e.g., SCAN, LOOK, or proximity/direction heuristic) to assign hall calls to the most suitable car.',
      'Support weight sensor thresholds and emergency stop/fire alarm safety overrides.',
    ],
    constraints: [
      'Elevators must respect maximum weight capacity limits before closing doors.',
      'Dispatching logic should be decoupled from physical elevator car hardware abstraction.',
    ],
  },
  {
    slug: 'notification-system',
    title: 'Multi-Channel Notification System',
    difficulty: 'medium' as const,
    description:
      'Design a centralized notification platform that dispatches messages to users across SMS, Email, and Push notification channels with templating and rate limiting.',
    requirements: [
      'Support multiple delivery channels: Email, SMS, and Mobile Push Notifications.',
      'Allow clients to trigger notifications using registered templates and dynamic variable substitution.',
      'Support user notification preferences (e.g., opted-out of promotional SMS, preferred email only).',
      'Implement priority levels (Critical/Transactional vs. Marketing/Promotional) with appropriate queueing or precedence.',
      'Enforce per-user and per-channel rate limits to prevent spamming users.',
      'Handle channel provider failover (e.g., if primary SMS provider fails, fallback to secondary provider).',
    ],
    constraints: [
      'Critical security alerts (e.g., OTPs) must bypass promotional rate limits and use high priority.',
      'System must be extensible to easily integrate new delivery channels (e.g., WhatsApp, Webhooks) without modifying core orchestration.',
    ],
  },
];

export async function seedProblems(): Promise<{ seededCount: number; totalCount: number }> {
  let seededCount = 0;

  for (const problemData of SEED_PROBLEMS) {
    const existing = await ProblemModel.findOne({ slug: problemData.slug });
    if (!existing) {
      await ProblemModel.create(problemData);
      seededCount++;
    } else {
      // Update fields to keep seed sync without creating duplicates
      await ProblemModel.updateOne({ slug: problemData.slug }, { $set: problemData });
    }
  }

  const totalCount = await ProblemModel.countDocuments();
  return { seededCount, totalCount };
}
