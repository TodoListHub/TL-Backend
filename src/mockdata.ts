/**
 * seed.ts
 *
 * This file creates mock data for testing authentication and task endpoints.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // -------------------------- Clean up existing data --------------------------
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Cleared existing Users and Tasks.');

  // -------------------------- 1. Create sample users (Authentication) --------------------------
  // These users are used for testing signIn, logIn, sendEmail, resetPassword, status, and deleteUser endpoints.
  const usersData = [
    {
      username: 'testuser1',
      email: 'testuser1@example.com',
      password: await bcrypt.hash('TestPass123', 10),
    },
    {
      username: 'testuser2',
      email: 'testuser2@example.com',
      password: await bcrypt.hash('TestPass456', 10),
    },
    {
      username: 'testuser3',
      email: 'testuser3@example.com',
      password: await bcrypt.hash('TestPass789', 10),
    },
  ];

  const createdUsers = await prisma.user.createMany({
    data: usersData,
  });
  console.log('Seeded Users:', createdUsers);

  // Retrieve all users to get their IDs for further references
  const users = await prisma.user.findMany();
  console.log('All Users with IDs:', users);

  // -------------------------- 2. Create sample tasks (Tasks) --------------------------
  // Create sample tasks for testing createTask, getTasks, updateTask, and deleteTask endpoints.
  const tasksData = [
    // Tasks for testuser1
    {
      title: 'Testuser1 Task 1',
      status: false,
      userId: users.find(u => u.username === 'testuser1')!.id,
    },
    {
      title: 'Testuser1 Task 2',
      status: true,
      userId: users.find(u => u.username === 'testuser1')!.id,
    },
    // Tasks for testuser2
    {
      title: 'Testuser2 Task 1',
      status: false,
      userId: users.find(u => u.username === 'testuser2')!.id,
    },
    {
      title: 'Testuser2 Task 2',
      status: false,
      userId: users.find(u => u.username === 'testuser2')!.id,
    },
    // Tasks for testuser3
    {
      title: 'Testuser3 Task 1',
      status: true,
      userId: users.find(u => u.username === 'testuser3')!.id,
    },
  ];

  const createdTasks = await prisma.task.createMany({
    data: tasksData,
  });
  console.log('Seeded Tasks:', createdTasks);

  // Retrieve all tasks to verify data
  const tasks = await prisma.task.findMany();
  console.log('All Tasks with IDs:', tasks);

  // -------------------------- 3. Additional operations for testing specific endpoints --------------------------
  // (a) sendEmail: For testing the sendEmail endpoint, you may use testuser1's email.
  const sendEmailUser = users.find(u => u.username === 'testuser1');
  console.log('For sendEmail endpoint, use email:', sendEmailUser?.email);

  // (b) resetPassword: For testing resetPassword, update testuser2’s password to a new one.
  const newPasswordHash = await bcrypt.hash('NewTestPass456', 10);
  const updatedUser = await prisma.user.update({
    where: { id: users.find(u => u.username === 'testuser2')!.id },
    data: { password: newPasswordHash },
  });
  console.log('Updated password for testuser2:', updatedUser);

  // (c) deleteUser: To test the deleteUser endpoint, you can call the delete commands manually.
  // Uncomment the lines below to delete all users and tasks.
  // await prisma.task.deleteMany({});
  // await prisma.user.deleteMany({});
  // console.log('Deleted all Users and Tasks for deleteUser endpoint test.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
