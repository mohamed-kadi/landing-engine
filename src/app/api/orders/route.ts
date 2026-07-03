import { randomUUID } from 'node:crypto';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import {
  validateOrderSubmission,
  type ValidatedOrderSubmission,
} from '../../../lib/orders/orderSchema';

export const runtime = 'nodejs';

type StoredOrder = ValidatedOrderSubmission & {
  orderId: string;
  serverReceivedAt: string;
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        ok: false,
        errors: {
          body: 'Request body must be valid JSON.',
        },
      },
      { status: 400 }
    );
  }

  const validation = await validateOrderSubmission(body);

  if (!validation.ok) {
    return Response.json(
      {
        ok: false,
        errors: validation.errors,
      },
      { status: 400 }
    );
  }

  const order: StoredOrder = {
    ...validation.order,
    orderId: randomUUID(),
    serverReceivedAt: new Date().toISOString(),
  };

  console.info('[orders] COD order received', order);

  const storage = await persistOrderForDevelopment(order);

  return Response.json(
    {
      ok: true,
      orderId: order.orderId,
      storage,
    },
    { status: 201 }
  );
}

async function persistOrderForDevelopment(order: StoredOrder) {
  if (process.env.NODE_ENV === 'production') {
    return {
      mode: 'server-log-only',
      reason: 'Local JSONL storage is disabled in production runtime.',
    };
  }

  const storageDirectory = path.join(process.cwd(), 'data');
  const storagePath = path.join(storageDirectory, 'orders.jsonl');

  try {
    await mkdir(storageDirectory, { recursive: true });
    await appendFile(storagePath, `${JSON.stringify(order)}\n`, 'utf8');

    return {
      mode: 'jsonl',
      path: 'data/orders.jsonl',
    };
  } catch (error) {
    console.error('[orders] Failed to write local JSONL order storage', error);

    return {
      mode: 'server-log-only',
      reason: 'Local JSONL write failed; order was logged on the server.',
    };
  }
}
