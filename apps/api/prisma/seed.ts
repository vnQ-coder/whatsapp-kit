import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================
  // CREATE USERS
  // ============================================
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@whatsappkit.com' },
    update: {},
    create: {
      email: 'admin@whatsappkit.com',
      name: 'Admin User',
      password: hashedPassword,
      emailVerified: true,
      theme: 'system',
      fontSize: 'md',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      password: hashedPassword,
      emailVerified: true,
      theme: 'dark',
      fontSize: 'md',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
  });

  console.log('✅ Users created');

  // ============================================
  // CREATE API KEYS
  // ============================================
  console.log('Creating API keys...');
  await prisma.apiKey.upsert({
    where: { key: 'wsk_1234567890abcdef' },
    update: {},
    create: {
      name: 'WhatsApp Cloud API',
      key: 'wsk_1234567890abcdef',
      webhookUrl: 'https://api.whatsappkit.com/webhook',
      isActive: true,
      userId: user1.id,
    },
  });
  console.log('✅ API keys created');

  // ============================================
  // CREATE CONTACTS
  // ============================================
  console.log('Creating contacts...');
  const contact1 = await prisma.contact.create({
    data: {
      name: 'John Doe',
      phone: '+1234567890',
      email: 'john.doe@example.com',
      status: 'Active',
      userId: user1.id,
      metadata: {
        company: 'Acme Corp',
        tags: ['VIP', 'Customer'],
      },
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      name: 'Jane Smith',
      phone: '+1234567891',
      email: 'jane.smith@example.com',
      status: 'Active',
      userId: user1.id,
      metadata: {
        company: 'Tech Inc',
        tags: ['Premium'],
      },
    },
  });

  const contact3 = await prisma.contact.create({
    data: {
      name: 'Bob Johnson',
      phone: '+1234567892',
      email: 'bob.johnson@example.com',
      status: 'Inactive',
      userId: user1.id,
    },
  });

  const contact4 = await prisma.contact.create({
    data: {
      name: 'Alice Williams',
      phone: '+1234567893',
      email: 'alice.williams@example.com',
      status: 'Active',
      userId: user1.id,
    },
  });

  const contact5 = await prisma.contact.create({
    data: {
      name: 'Charlie Brown',
      phone: '+1234567894',
      email: 'charlie.brown@example.com',
      status: 'Active',
      userId: user1.id,
    },
  });

  console.log('✅ Contacts created');

  // ============================================
  // CREATE CONTACT GROUPS
  // ============================================
  console.log('Creating contact groups...');
  const group1 = await prisma.contactGroup.create({
    data: {
      name: 'VIP Customers',
      description: 'VIP customer group',
      type: 'static',
      userId: user1.id,
      members: {
        create: [
          { contactId: contact1.id },
          { contactId: contact2.id },
        ],
      },
    },
  });

  const group2 = await prisma.contactGroup.create({
    data: {
      name: 'All Users',
      description: 'All active users',
      type: 'dynamic',
      userId: user1.id,
      filters: {
        create: [
          {
            field: 'status',
            operator: 'equals',
            value: 'Active',
          },
        ],
      },
      members: {
        create: [
          { contactId: contact1.id },
          { contactId: contact2.id },
          { contactId: contact4.id },
          { contactId: contact5.id },
        ],
      },
    },
  });

  const group3 = await prisma.contactGroup.create({
    data: {
      name: 'Marketing Team',
      description: 'Marketing team group',
      type: 'static',
      userId: user1.id,
      members: {
        create: [
          { contactId: contact1.id },
          { contactId: contact2.id },
          { contactId: contact3.id },
        ],
      },
    },
  });

  console.log('✅ Contact groups created');

  // ============================================
  // CREATE TEMPLATES
  // ============================================
  console.log('Creating templates...');
  const template1 = await prisma.template.create({
    data: {
      name: 'welcome_message',
      title: 'Welcome Message',
      body: 'Hello {{1}}, welcome to WhatsApp Kit! We\'re excited to have you on board.',
      header: 'Welcome to WhatsApp Kit',
      category: 'UTILITY',
      language: 'en',
      status: 'APPROVED',
      variables: ['name'],
      userId: user1.id,
    },
  });

  const template2 = await prisma.template.create({
    data: {
      name: 'order_confirmation',
      title: 'Order Confirmation',
      body: 'Hi {{1}}, your order #{{2}} has been confirmed. Expected delivery: {{3}}',
      category: 'UTILITY',
      language: 'en',
      status: 'APPROVED',
      variables: ['name', 'orderId', 'deliveryDate'],
      userId: user1.id,
    },
  });

  const template3 = await prisma.template.create({
    data: {
      name: 'promotional_offer',
      title: 'Special Offer',
      body: '🎉 Special offer! Get {{1}}% off on all products. Use code: {{2}}. Valid until {{3}}',
      category: 'MARKETING',
      language: 'en',
      status: 'APPROVED',
      variables: ['discount', 'code', 'expiry'],
      buttons: [
        {
          type: 'QUICK_REPLY',
          text: 'Shop Now',
        },
      ],
      userId: user1.id,
    },
  });

  const template4 = await prisma.template.create({
    data: {
      name: 'appointment_reminder',
      title: 'Appointment Reminder',
      body: 'Reminder: Your appointment is scheduled for {{1}} at {{2}}. See you there!',
      category: 'UTILITY',
      language: 'en',
      status: 'APPROVED',
      variables: ['date', 'time'],
      userId: user1.id,
    },
  });

  const template5 = await prisma.template.create({
    data: {
      name: 'verification_code',
      title: 'Verification Code',
      body: 'Your verification code is: {{1}}. Valid for 10 minutes.',
      category: 'AUTHENTICATION',
      language: 'en',
      status: 'APPROVED',
      variables: ['code'],
      userId: user1.id,
    },
  });

  console.log('✅ Templates created');

  // ============================================
  // CREATE CAMPAIGNS
  // ============================================
  console.log('Creating campaigns...');
  const campaign1 = await prisma.campaign.create({
    data: {
      name: 'Product Launch',
      description: 'Launch campaign for new product',
      templateId: template1.id,
      groupId: group1.id,
      schedule: new Date('2024-02-01T10:00:00Z'),
      status: 'SCHEDULED',
      throttle: 100,
      retries: 3,
      userId: user1.id,
      stats: {
        create: {
          total: 25,
          sent: 0,
          delivered: 0,
          read: 0,
          failed: 0,
        },
      },
      recipients: {
        create: [
          {
            contactId: contact1.id,
            status: 'PENDING',
          },
          {
            contactId: contact2.id,
            status: 'PENDING',
          },
        ],
      },
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      name: 'Monthly Newsletter',
      description: 'Monthly marketing update',
      templateId: template3.id,
      groupId: group2.id,
      schedule: new Date('2024-01-30T09:00:00Z'),
      status: 'COMPLETED',
      throttle: 150,
      retries: 3,
      userId: user1.id,
      startedAt: new Date('2024-01-30T09:00:00Z'),
      completedAt: new Date('2024-01-30T09:30:00Z'),
      stats: {
        create: {
          total: 150,
          sent: 150,
          delivered: 145,
          read: 130,
          failed: 5,
        },
      },
      recipients: {
        create: [
          {
            contactId: contact1.id,
            status: 'READ',
            sentAt: new Date('2024-01-30T09:05:00Z'),
            deliveredAt: new Date('2024-01-30T09:05:02Z'),
            readAt: new Date('2024-01-30T09:10:00Z'),
          },
          {
            contactId: contact2.id,
            status: 'READ',
            sentAt: new Date('2024-01-30T09:05:00Z'),
            deliveredAt: new Date('2024-01-30T09:05:02Z'),
            readAt: new Date('2024-01-30T09:12:00Z'),
          },
        ],
      },
    },
  });

  console.log('✅ Campaigns created');

  // ============================================
  // CREATE CONVERSATIONS
  // ============================================
  console.log('Creating conversations...');
  const conversation1 = await prisma.conversation.create({
    data: {
      name: 'John Doe',
      type: 'individual',
      phoneNumber: '+1234567890',
      isOnline: true,
      unreadCount: 2,
      userId: user1.id,
      whatsappId: 'whatsapp_conv_1',
      participants: {
        create: [
          {
            contactId: contact1.id,
            name: 'John Doe',
            phoneNumber: '+1234567890',
            role: 'member',
          },
        ],
      },
    },
  });

  const conversation2 = await prisma.conversation.create({
    data: {
      name: 'Marketing Team',
      type: 'group',
      unreadCount: 5,
      userId: user1.id,
      whatsappId: 'whatsapp_conv_2',
      participants: {
        create: [
          {
            contactId: contact1.id,
            name: 'John Doe',
            phoneNumber: '+1234567890',
            role: 'member',
          },
          {
            contactId: contact2.id,
            name: 'Jane Smith',
            phoneNumber: '+1234567891',
            role: 'admin',
          },
          {
            name: 'You',
            phoneNumber: '+1234567899',
            role: 'admin',
          },
        ],
      },
    },
  });

  const conversation3 = await prisma.conversation.create({
    data: {
      name: 'Jane Smith',
      type: 'individual',
      phoneNumber: '+1234567891',
      isOnline: false,
      unreadCount: 0,
      userId: user1.id,
      whatsappId: 'whatsapp_conv_3',
      participants: {
        create: [
          {
            contactId: contact2.id,
            name: 'Jane Smith',
            phoneNumber: '+1234567891',
            role: 'member',
          },
        ],
      },
    },
  });

  console.log('✅ Conversations created');

  // ============================================
  // CREATE MESSAGES
  // ============================================
  console.log('Creating messages...');
  const message1 = await prisma.message.create({
    data: {
      conversationId: conversation1.id,
      senderId: user1.id,
      senderName: 'You',
      text: 'Hello! I\'m interested in your WhatsApp service.',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      readAt: new Date(Date.now() - 55 * 60 * 1000),
    },
  });

  const message2 = await prisma.message.create({
    data: {
      conversationId: conversation1.id,
      senderPhone: '+1234567890',
      senderName: 'John Doe',
      text: 'Thanks for reaching out! How can I help you today?',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 55 * 60 * 1000),
      readAt: new Date(Date.now() - 50 * 60 * 1000),
    },
  });

  const message3 = await prisma.message.create({
    data: {
      conversationId: conversation1.id,
      senderPhone: '+1234567890',
      senderName: 'John Doe',
      text: 'I\'d like to know more about your pricing plans.',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
      readAt: new Date(Date.now() - 45 * 60 * 1000),
    },
  });

  const message4 = await prisma.message.create({
    data: {
      conversationId: conversation1.id,
      senderId: user1.id,
      senderName: 'You',
      text: 'Sure! Let me send you our pricing information.',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      readAt: new Date(Date.now() - 40 * 60 * 1000),
    },
  });

  const message5 = await prisma.message.create({
    data: {
      conversationId: conversation1.id,
      senderPhone: '+1234567890',
      senderName: 'John Doe',
      text: 'Thanks for the update!',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      readAt: new Date(Date.now() - 4 * 60 * 1000),
    },
  });

  // Update conversation with last message
  await prisma.conversation.update({
    where: { id: conversation1.id },
    data: {
      lastMessageId: message5.id,
      lastMessageAt: message5.timestamp,
    },
  });

  // Group messages
  const groupMessage1 = await prisma.message.create({
    data: {
      conversationId: conversation2.id,
      senderPhone: '+1234567891',
      senderName: 'Sarah',
      text: 'The campaign is ready',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
    },
  });

  await prisma.conversation.update({
    where: { id: conversation2.id },
    data: {
      lastMessageId: groupMessage1.id,
      lastMessageAt: groupMessage1.timestamp,
    },
  });

  console.log('✅ Messages created');

  // ============================================
  // CREATE CHATBOT FLOWS
  // ============================================
  console.log('Creating chatbot flows...');
  await prisma.chatbotFlow.create({
    data: {
      name: 'Welcome Flow',
      description: 'Initial welcome flow for new users',
      isActive: true,
      userId: user1.id,
      flowData: {
        nodes: [
          {
            id: '1',
            type: 'message',
            position: { x: 250, y: 100 },
            data: {
              label: 'Welcome Message',
              content: 'Hello! How can I help you today?',
              type: 'text',
            },
          },
        ],
        edges: [],
      },
    },
  });

  console.log('✅ Chatbot flows created');

  // ============================================
  // CREATE NOTIFICATIONS
  // ============================================
  console.log('Creating notifications...');
  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        title: 'Campaign sent',
        message: 'Marketing Campaign has been sent successfully',
        type: 'success',
        isRead: false,
      },
      {
        userId: user1.id,
        title: 'Template created',
        message: 'Welcome Message template has been created',
        type: 'info',
        isRead: false,
      },
      {
        userId: user1.id,
        title: 'Contact added',
        message: 'John Doe has been added to your contacts',
        type: 'info',
        isRead: true,
      },
    ],
  });

  console.log('✅ Notifications created');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

