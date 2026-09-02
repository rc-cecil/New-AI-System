export type QueueJob = {
  id: string;
  queue: string;
  data: Record<string, unknown>;
  createdAt: string;
};

export class JobQueueService {
  private readonly queues = new Map<string, QueueJob[]>();

  async enqueue(queue: string, data: Record<string, unknown>): Promise<string> {
    const job: QueueJob = {
      id: `${queue}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      queue,
      data,
      createdAt: new Date().toISOString(),
    };

    const existing = this.queues.get(queue) ?? [];
    existing.push(job);
    this.queues.set(queue, existing);
    return job.id;
  }

  async processNext(queue: string): Promise<QueueJob | null> {
    const jobs = this.queues.get(queue) ?? [];
    const next = jobs.shift();
    if (!next) {
      return null;
    }
    this.queues.set(queue, jobs);
    return next;
  }
}
