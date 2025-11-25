import { requireAuth } from '@/lib/auth';
import { Cache, CacheTTL } from '@/lib/cache';
import { logger } from '@/lib/logger';
import { n8nClient } from '@/lib/n8n-client';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/chatbots
 * List all chatbots for the authenticated user
 */
export async function GET() {
  try {
    const user = await requireAuth();
    
    // Try to get from cache first
    const cacheKey = Cache.key('chatbots', user.id);
    const cached = await Cache.get(cacheKey);
    
    if (cached) {
      logger.debug({ userId: user.id }, 'Chatbots retrieved from cache');
      return NextResponse.json(cached);
    }

    const chatbots = await prisma.chatbot.findMany({
      where: { userId: user.id },
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

    const response = { chatbots };
    
    // Cache for 5 minutes
    await Cache.set(cacheKey, response, CacheTTL.MEDIUM);
    
    logger.info({ userId: user.id, count: chatbots.length }, 'Chatbots retrieved');
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    logger.error({ error }, 'Error fetching chatbots');
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
    const user = await requireAuth();
    const body = await request.json();
    const { name, description, config } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Create chatbot in database first to get ID
    const chatbot = await prisma.chatbot.create({
      data: {
        name,
        description,
        config: config || {},
        userId: user.id,
      },
    });

    logger.info({ userId: user.id, chatbotId: chatbot.id }, 'Chatbot created');

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

      // Invalidate cache
      await Cache.delete(Cache.key('chatbots', user.id));

      logger.info({ chatbotId: chatbot.id, workflowId }, 'n8n workflow created');
      return NextResponse.json({ chatbot: updatedChatbot }, { status: 201 });
    } catch (n8nError) {
      // If n8n workflow creation fails, still return the chatbot
      // but mark it as inactive
      logger.error({ error: n8nError, chatbotId: chatbot.id }, 'n8n workflow creation failed');
      
      const updatedChatbot = await prisma.chatbot.update({
        where: { id: chatbot.id },
        data: { isActive: false },
      });

      // Invalidate cache
      await Cache.delete(Cache.key('chatbots', user.id));

      return NextResponse.json(
        {
          chatbot: updatedChatbot,
          warning: 'Chatbot created but n8n workflow failed. Please configure manually.',
        },
        { status: 201 }
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    logger.error({ error }, 'Error creating chatbot');
    return NextResponse.json(
      { error: 'Failed to create chatbot' },
      { status: 500 }
    );
  }
}
