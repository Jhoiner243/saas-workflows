import { n8nClient } from '@/lib/n8n-client';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/chatbots
 * List all chatbots
 */
export async function GET() {
  try {
    // For MVP, we'll use a default user ID
    // In production, this would come from authentication
    const defaultUserId = 'default-user';

    const chatbots = await prisma.chatbot.findMany({
      where: { userId: defaultUserId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            messages: true,
            conversations: true,
          },
        },
      },
    });

    return NextResponse.json({ chatbots });
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chatbots' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chatbots
 * Create a new chatbot
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, config } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // For MVP, we'll use a default user ID
    const defaultUserId = 'default-user';

    // Ensure default user exists
    await prisma.user.upsert({
      where: { id: defaultUserId },
      update: {},
      create: {
        id: defaultUserId,
        email: 'demo@example.com',
        name: 'Demo User',
      },
    });

    // Create chatbot in database first to get ID
    const chatbot = await prisma.chatbot.create({
      data: {
        name,
        description,
        config: config || {},
        userId: defaultUserId,
      },
    });

    // Create n8n workflow
    try {
      const { workflowId, webhookUrl } = await n8nClient.createChatbotWorkflow(
        name,
        chatbot.id
      );

      // Update chatbot with n8n details
      const updatedChatbot = await prisma.chatbot.update({
        where: { id: chatbot.id },
        data: {
          n8nWorkflowId: workflowId,
          n8nWebhookUrl: webhookUrl,
        },
      });

      return NextResponse.json({ chatbot: updatedChatbot }, { status: 201 });
    } catch (n8nError) {
      // If n8n workflow creation fails, still return the chatbot
      // but mark it as inactive
      console.error('n8n workflow creation failed:', n8nError);
      
      const updatedChatbot = await prisma.chatbot.update({
        where: { id: chatbot.id },
        data: { isActive: false },
      });

      return NextResponse.json(
        {
          chatbot: updatedChatbot,
          warning: 'Chatbot created but n8n workflow failed. Please configure manually.',
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error creating chatbot:', error);
    return NextResponse.json(
      { error: 'Failed to create chatbot' },
      { status: 500 }
    );
  }
}
