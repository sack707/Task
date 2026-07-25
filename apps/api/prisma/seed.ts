import { PrismaClient, Role, TaskStatus, TaskPriority } from '../src/generated/prisma-client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Password hash for all test accounts: Password123!
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // 2. Create Members
  const member1 = await prisma.user.create({
    data: {
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      password: hashedPassword,
      role: Role.MEMBER,
    },
  });

  const member2 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: Role.MEMBER,
    },
  });

  console.log('✅ Created 3 Users (1 Admin, 2 Members)');

  // 3. Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Platform Redesign v2',
      description: 'Modernizing the core UI design system and state architecture.',
      createdById: admin.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App API Integration',
      description: 'REST API expansion for iOS and Android native clients.',
      createdById: admin.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Security Audit & Compliance',
      description: 'Quarterly vulnerability assessments, penetration tests, and SOC2 compliance.',
      createdById: admin.id,
    },
  });

  console.log('✅ Created 3 Projects');

  // 4. Create 10 Tasks
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const inOneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const tasksData = [
    {
      title: 'Design System Figma Tokens',
      description: 'Export updated CSS variables and color palettes for dark mode.',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      dueDate: yesterday,
      assignedToId: member1.id,
      projectId: project1.id,
    },
    {
      title: 'Implement Navigation Sidebar',
      description: 'Build accessible dynamic sidebar with collapsed mode.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      dueDate: inThreeDays,
      assignedToId: member1.id,
      projectId: project1.id,
    },
    {
      title: 'Setup Responsive Layout Grid',
      description: 'Ensure layout renders seamlessly across desktop, tablet, and mobile screens.',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: inOneWeek,
      assignedToId: member2.id,
      projectId: project1.id,
    },
    {
      title: 'OAuth2 Authentication Service',
      description: 'Implement JWT refresh token mechanism and session validation.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: yesterday, // Overdue task
      assignedToId: member2.id,
      projectId: project2.id,
    },
    {
      title: 'Push Notification Webhooks',
      description: 'Integrate WebPush service and background queue processors.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: inThreeDays,
      assignedToId: member1.id,
      projectId: project2.id,
    },
    {
      title: 'API Rate Limiting Middleware',
      description: 'Protect public API endpoints against burst traffic attacks.',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      dueDate: yesterday,
      assignedToId: admin.id,
      projectId: project2.id,
    },
    {
      title: 'Vulnerability Scanning Setup',
      description: 'Configure automated dependency vulnerability scanner in CI/CD pipeline.',
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      dueDate: yesterday,
      assignedToId: member2.id,
      projectId: project3.id,
    },
    {
      title: 'Database Encryption at Rest',
      description: 'Enable PostgreSQL transparent data encryption and KMS key rotation.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: inThreeDays,
      assignedToId: member1.id,
      projectId: project3.id,
    },
    {
      title: 'Role-Based Access Policy Review',
      description: 'Verify RBAC guards across all protected NestJS endpoints.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: inOneWeek,
      assignedToId: admin.id,
      projectId: project3.id,
    },
    {
      title: 'SOC2 Type II Evidence Collection',
      description: 'Gather system logs, audit trails, and access grant documentation.',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: inOneWeek,
      assignedToId: member2.id,
      projectId: project3.id,
    },
  ];

  for (const task of tasksData) {
    await prisma.task.create({ data: task });
  }

  console.log('✅ Created 10 Tasks');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
