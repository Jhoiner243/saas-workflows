import { n8nClient } from '@/lib/n8n-client';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/chatbots/[id]/messages
 * Get messages for a chatbot
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    const where: any = { chatbotId: params.id };
    if (conversationId) {
      where.conversationId = conversationId;
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take: 100, // Limit to last 100 messages
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chatbots/[id]/messages
 * Send a message to the chatbot
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { content, conversationId } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Get chatbot
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: params.id },
    });

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    if (!chatbot.isActive) {
      return NextResponse.json(
        { error: 'Chatbot is not active' },
        { status: 400 }
      );
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          chatbotId: params.id,
          title: content.substring(0, 50),
        },
      });
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        content,
        role: 'user',
        conversationId: conversation.id,
        chatbotId: params.id,
      },
    });

    // Trigger n8n workflow
    let assistantMessage;
    if (chatbot.n8nWebhookUrl) {
      try {
        const response = await n8nClient.triggerWorkflow(
          chatbot.n8nWebhookUrl,
          content
        );

        // Save assistant response
        assistantMessage = await prisma.message.create({
          data: {
            content: response.message || 'No response from chatbot',
            role: 'assistant',
            conversationId: conversation.id,
            chatbotId: params.id,
          },
        });
      } catch (error) {
        console.error('Error triggering n8n workflow:', error);
        
        // Save error message
        assistantMessage = await prisma.message.create({
          data: {
            content: 'Sorry, I encountered an error processing your message.',
            role: 'assistant',
            conversationId: conversation.id,
            chatbotId: params.id,
          },
        });
      }
    } else {
      // No webhook configured, return default message
      assistantMessage = await prisma.message.create({
        data: {
          content: 'Chatbot is not configured with an n8n workflow.',
          role: 'assistant',
          conversationId: conversation.id,
          chatbotId: params.id,
        },
      });
    }

    return NextResponse.json({
      userMessage,
      assistantMessage,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
