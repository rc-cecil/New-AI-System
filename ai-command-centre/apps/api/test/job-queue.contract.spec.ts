import { describe, expect, it } from 'vitest';
import { JobQueueService } from '../src/job-queue.service';

describe('job queue contract', () => {
  it('enqueues and processes a sample job', async () => {
    const service = new JobQueueService();

    const jobId = await service.enqueue('sample-job', {
      type: 'heartbeat-check',
      payload: { ok: true },
    });

    const result = await service.processNext('sample-job');

    expect(jobId).toMatch(/sample-job-/);
    expect(result).toMatchObject({
      id: jobId,
      data: {
        type: 'heartbeat-check',
        payload: { ok: true },
      },
    });
  });
});
