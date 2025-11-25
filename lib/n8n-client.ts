/**
 * n8n API Client
 * Handles communication with n8n instance for workflow management
 */

const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:5678/api/v1';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

interface N8nWorkflow {
  id?: string;
  name: string;
  active: boolean;
  nodes: any[];
  connections: any;
  settings?: any;
}

export class N8nClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = N8N_API_URL;
    this.apiKey = N8N_API_KEY;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': this.apiKey,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`n8n API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a basic chatbot workflow in n8n
   */
  async createChatbotWorkflow(chatbotName: string, chatbotId: string): Promise<{ workflowId: string; webhookUrl: string }> {
    const workflow: N8nWorkflow = {
      name: `Chatbot: ${chatbotName}`,
      active: true,
      nodes: [
        {
          parameters: {
            httpMethod: 'POST',
            path: `chatbot/${chatbotId}`,
            responseMode: 'responseNode',
            options: {},
          },
          id: 'webhook-node',
          name: 'Webhook',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [250, 300],
          webhookId: chatbotId,
        },
        {
          parameters: {
            values: {
              string: [
                {
                  name: 'response',
                  value: '={{ $json.body.message }}',
                },
              ],
            },
            options: {},
          },
          id: 'set-node',
          name: 'Process Message',
          type: 'n8n-nodes-base.set',
          typeVersion: 1,
          position: [450, 300],
        },
        {
          parameters: {
            respondWith: 'json',
            responseBody: '={{ { "message": "Echo: " + $json.response } }}',
          },
          id: 'respond-node',
          name: 'Respond to Webhook',
          type: 'n8n-nodes-base.respondToWebhook',
          typeVersion: 1,
          position: [650, 300],
        },
      ],
      connections: {
        Webhook: {
          main: [[{ node: 'Process Message', type: 'main', index: 0 }]],
        },
        'Process Message': {
          main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]],
        },
      },
      settings: {
        executionOrder: 'v1',
      },
    };

    try {
      const result = await this.request('/workflows', {
        method: 'POST',
        body: JSON.stringify(workflow),
      });

      const webhookUrl = `${this.baseUrl.replace('/api/v1', '')}/webhook/chatbot/${chatbotId}`;
      
      return {
        workflowId: result.id,
        webhookUrl,
      };
    } catch (error) {
      console.error('Error creating n8n workflow:', error);
      throw error;
    }
  }

  /**
   * Trigger a chatbot workflow
   */
  async triggerWorkflow(webhookUrl: string, message: string): Promise<any> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Webhook trigger failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error triggering workflow:', error);
      throw error;
    }
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(workflowId: string): Promise<void> {
    try {
      await this.request(`/workflows/${workflowId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting workflow:', error);
      throw error;
    }
  }

  /**
   * Update workflow active status
   */
  async updateWorkflowStatus(workflowId: string, active: boolean): Promise<void> {
    try {
      await this.request(`/workflows/${workflowId}`, {
        method: 'PATCH',
        body: JSON.stringify({ active }),
      });
    } catch (error) {
      console.error('Error updating workflow status:', error);
      throw error;
    }
  }
}

export const n8nClient = new N8nClient();
