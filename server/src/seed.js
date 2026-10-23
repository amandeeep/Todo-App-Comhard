import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Task from './models/Task.js';
import Section from './models/Section.js';
import connectDB from './config/db.js';

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await Task.deleteMany({});
  await Section.deleteMany({});

  const user1 = await User.create({ name: 'Amandeep', email: 'amandeep@example.com', password: 'amandeep123' });
  const user2 = await User.create({ name: 'Akagra', email: 'akagra@example.com', password: 'akagra123' });

  const sections = await Section.insertMany([
    { name: 'Backlog', order: 0, color: '#94a3b8', isDefault: true, createdBy: user1._id },
    { name: 'To Do', order: 1, color: '#60a5fa', isDefault: true, createdBy: user1._id },
    { name: 'In Progress', order: 2, color: '#fbbf24', isDefault: true, createdBy: user1._id },
    { name: 'In Review', order: 3, color: '#a78bfa', isDefault: true, createdBy: user1._id },
    { name: 'Done', order: 4, color: '#34d399', isDefault: true, createdBy: user1._id },
  ]);

  const now = new Date();
  const h = 60 * 60 * 1000;
  const d = 24 * h;

  const tasks = [
    {
      title: 'Design landing page wireframes',
      description: 'Create wireframes for the new product landing page including hero section, features, pricing, and footer.',
      status: 'In Progress', priority: 'High',
      startAt: new Date(now.getTime() - 2 * d), dueAt: new Date(now.getTime() + 1 * d),
      estimatedDurationMinutes: 480, timeSpentMinutes: 240, slaDurationMinutes: 4320,
      tags: ['design', 'landing-page'], sectionId: sections[2]._id, createdBy: user1._id, order: 0,
    },
    {
      title: 'Implement user authentication',
      description: 'Set up JWT-based authentication with login, register, and password reset.',
      status: 'Done', priority: 'Urgent',
      startAt: new Date(now.getTime() - 5 * d), dueAt: new Date(now.getTime() - 1 * d),
      estimatedDurationMinutes: 960, actualDurationMinutes: 720, timeSpentMinutes: 720, slaDurationMinutes: 5760,
      completedAt: new Date(now.getTime() - 1.5 * d),
      tags: ['backend', 'auth', 'security'], sectionId: sections[4]._id, createdBy: user1._id, order: 0,
    },
    {
      title: 'Fix responsive navigation menu',
      description: 'The hamburger menu is not appearing correctly on tablets. Fix CSS breakpoints.',
      status: 'To Do', priority: 'Medium',
      startAt: new Date(now.getTime() - 1 * d), dueAt: new Date(now.getTime() + 2 * d),
      estimatedDurationMinutes: 120, slaDurationMinutes: 1440,
      tags: ['bug', 'frontend', 'responsive'], sectionId: sections[1]._id, createdBy: user1._id, order: 0,
    },
    {
      title: 'Write API documentation',
      description: 'Document all REST API endpoints including request/response formats and error codes.',
      status: 'Backlog', priority: 'Low',
      dueAt: new Date(now.getTime() + 7 * d), estimatedDurationMinutes: 360,
      tags: ['docs', 'api'], sectionId: sections[0]._id, createdBy: user1._id, order: 0,
    },
    {
      title: 'Set up CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment to staging.',
      status: 'In Review', priority: 'High',
      startAt: new Date(now.getTime() - 3 * d), dueAt: new Date(now.getTime() + 0.5 * d),
      estimatedDurationMinutes: 480, timeSpentMinutes: 420, slaDurationMinutes: 4320,
      tags: ['devops', 'ci-cd'], sectionId: sections[3]._id, createdBy: user1._id, order: 0,
    },
    {
      title: 'Database performance optimization',
      description: 'Add indexes, optimize slow queries, and implement connection pooling.',
      status: 'To Do', priority: 'High',
      dueAt: new Date(now.getTime() + 3 * d), estimatedDurationMinutes: 240, slaDurationMinutes: 2880,
      tags: ['backend', 'database', 'performance'], sectionId: sections[1]._id, createdBy: user1._id, order: 1,
    },
    {
      title: 'Create onboarding tutorial',
      description: 'Design and implement an interactive onboarding experience for new users.',
      status: 'Backlog', priority: 'Medium',
      dueAt: new Date(now.getTime() + 14 * d), estimatedDurationMinutes: 720,
      tags: ['ux', 'onboarding'], sectionId: sections[0]._id, createdBy: user1._id, order: 1,
    },
    {
      title: 'Integrate payment gateway',
      description: 'Set up Stripe integration for subscription billing with webhook handling.',
      status: 'In Progress', priority: 'Urgent',
      startAt: new Date(now.getTime() - 1 * d), dueAt: new Date(now.getTime() + 0.25 * d),
      estimatedDurationMinutes: 960, timeSpentMinutes: 300, slaDurationMinutes: 2880,
      tags: ['backend', 'payments', 'stripe'], sectionId: sections[2]._id, createdBy: user1._id, order: 1,
    },
    {
      title: 'Accessibility audit',
      description: 'Run WCAG 2.1 AA compliance audit and fix identified issues.',
      status: 'To Do', priority: 'Medium',
      dueAt: new Date(now.getTime() + 5 * d), estimatedDurationMinutes: 480, slaDurationMinutes: 5760,
      tags: ['accessibility', 'audit'], sectionId: sections[1]._id, createdBy: user1._id, order: 2,
    },
    {
      title: 'Implement search functionality',
      description: 'Add full-text search across tasks with filtering and autocomplete.',
      status: 'Done', priority: 'High',
      startAt: new Date(now.getTime() - 7 * d), dueAt: new Date(now.getTime() - 2 * d),
      estimatedDurationMinutes: 480, actualDurationMinutes: 600, timeSpentMinutes: 600, slaDurationMinutes: 4320,
      completedAt: new Date(now.getTime() - 3 * d),
      tags: ['frontend', 'search'], sectionId: sections[4]._id, createdBy: user1._id, order: 1,
    },
    {
      title: 'Email notification system',
      description: 'Build email notification service for task assignments and due date reminders.',
      status: 'Backlog', priority: 'Medium',
      dueAt: new Date(now.getTime() + 10 * d), estimatedDurationMinutes: 600,
      tags: ['backend', 'notifications', 'email'], sectionId: sections[0]._id, createdBy: user1._id, order: 2,
    },
    {
      title: 'Unit test coverage improvement',
      description: 'Increase test coverage to 80% for core modules.',
      status: 'In Progress', priority: 'Medium',
      startAt: new Date(now.getTime() - 2 * d), dueAt: new Date(now.getTime() + 4 * d),
      estimatedDurationMinutes: 960, timeSpentMinutes: 180, slaDurationMinutes: 7200,
      tags: ['testing', 'quality'], sectionId: sections[2]._id, createdBy: user1._id, order: 2,
    },
    {
      title: 'Security vulnerability patch',
      description: 'Apply critical security patches for dependency vulnerabilities.',
      status: 'In Progress', priority: 'Urgent',
      startAt: new Date(now.getTime() - 5 * d), dueAt: new Date(now.getTime() - 1 * d),
      estimatedDurationMinutes: 120, timeSpentMinutes: 90, slaDurationMinutes: 480,
      tags: ['security', 'urgent'], sectionId: sections[2]._id, createdBy: user1._id, order: 3,
    },
    {
      title: 'Mobile app prototype',
      description: 'Create a Figma prototype for the mobile app with key flows.',
      status: 'To Do', priority: 'Low',
      dueAt: new Date(now.getTime() + 21 * d), estimatedDurationMinutes: 1200,
      tags: ['design', 'mobile'], sectionId: sections[1]._id, createdBy: user1._id, order: 3,
    },
    {
      title: 'Data export feature',
      description: 'Allow users to export tasks as CSV, JSON, or PDF.',
      status: 'In Review', priority: 'Low',
      startAt: new Date(now.getTime() - 4 * d), dueAt: new Date(now.getTime() + 1 * d),
      estimatedDurationMinutes: 360, timeSpentMinutes: 330, slaDurationMinutes: 5760,
      tags: ['feature', 'export'], sectionId: sections[3]._id, createdBy: user1._id, order: 1,
    },
    {
      title: 'Research WebSocket implementation',
      description: 'Evaluate Socket.io vs native WebSockets for real-time features.',
      status: 'Backlog', priority: 'Low', estimatedDurationMinutes: 240,
      tags: ['research', 'real-time'], sectionId: sections[0]._id, createdBy: user1._id, order: 3,
    },
    {
      title: 'Dark mode refinements',
      description: 'Fine-tune dark mode colors and fix contrast issues.',
      status: 'Done', priority: 'Medium',
      startAt: new Date(now.getTime() - 10 * d), dueAt: new Date(now.getTime() - 5 * d),
      estimatedDurationMinutes: 180, actualDurationMinutes: 150, timeSpentMinutes: 150, slaDurationMinutes: 2880,
      completedAt: new Date(now.getTime() - 6 * d),
      tags: ['frontend', 'design', 'dark-mode'], sectionId: sections[4]._id, createdBy: user1._id, order: 2,
    },
    {
      title: 'API rate limiting configuration',
      description: 'Configure and test rate limiting for all public endpoints.',
      status: 'Done', priority: 'High',
      startAt: new Date(now.getTime() - 6 * d), dueAt: new Date(now.getTime() - 3 * d),
      estimatedDurationMinutes: 120, actualDurationMinutes: 90, timeSpentMinutes: 90, slaDurationMinutes: 1440,
      completedAt: new Date(now.getTime() - 4 * d),
      tags: ['backend', 'security'], sectionId: sections[4]._id, createdBy: user1._id, order: 3,
    },
  ];

  await Task.insertMany(tasks);

  await Task.create({
    title: 'Akagra private task',
    description: 'This should not be visible to Amandeep.',
    status: 'To Do', priority: 'Medium', createdBy: user2._id, order: 0,
  });

  console.log(`Seeded ${tasks.length + 1} tasks`);
  console.log('\nTest Accounts:');
  console.log('  amandeep@example.com / amandeep123');
  console.log('  akagra@example.com / akagra123');

  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
