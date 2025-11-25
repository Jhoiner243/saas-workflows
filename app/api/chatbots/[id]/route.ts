import { n8nClient } from '@/lib/n8n-client';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/chatbots/[id]
 * Get a specific chatbot
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            messages: true,
            conversations: true,
          },
        },
      },
    });

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ chatbot });
  } catch (error) {
    console.error('Error fetching chatbot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chatbot' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/chatbots/[id]
 * Update a chatbot
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, isActive, config } = body;

    const chatbot = await prisma.chatbot.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        ...(config && { config }),
      },
    });

    // Update n8n workflow status if isActive changed
    if (isActive !== undefined && chatbot.n8nWorkflowId) {
      try {
        await n8nClient.updateWorkflowStatus(chatbot.n8nWorkflowId, isActive);
      } catch (error) {
        console.error('Failed to update n8n workflow status:', error);
      }
    }

    return NextResponse.json({ chatbot });
  } catch (error) {
    console.error('Error updating chatbot:', error);
    return NextResponse.json(
      { error: 'Failed to update chatbot' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chatbots/[id]
 * Delete a chatbot
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: params.id },
    });

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    // Delete n8n workflow if exists
    if (chatbot.n8nWorkflowId) {
      try {
        await n8nClient.deleteWorkflow(chatbot.n8nWorkflowId);
      } catch (error) {
        console.error('Failed to delete n8n workflow:', error);
      }
    }

    // Delete chatbot (cascade will delete conversations and messages)
    await prisma.chatbot.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chatbot:', error);
    return NextResponse.json(
      { error: 'Failed to delete chatbot' },
      { status: 500 }
    );
  }
}
