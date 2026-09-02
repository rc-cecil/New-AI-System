import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('workspace/project contract', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates and lists workspaces for the authenticated user', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/workspaces')
      .set('x-user-id', 'user-123')
      .send({
        name: 'Alpha Workspace',
        slug: 'alpha-workspace',
      })
      .expect(201);

    expect(createResponse.body).toMatchObject({
      id: expect.any(String),
      name: 'Alpha Workspace',
      slug: 'alpha-workspace',
      ownerId: 'user-123',
    });

    const listResponse = await request(app.getHttpServer())
      .get('/workspaces')
      .set('x-user-id', 'user-123')
      .expect(200);

    expect(listResponse.body.items.length).toBeGreaterThan(0);
    expect(listResponse.body.items[0]).toMatchObject({
      ownerId: 'user-123',
    });
  });

  it('creates, updates, and deletes a project within a workspace', async () => {
    const workspaceResponse = await request(app.getHttpServer())
      .post('/workspaces')
      .set('x-user-id', 'user-456')
      .send({
        name: 'Beta Workspace',
        slug: 'beta-workspace',
      })
      .expect(201);

    const workspaceId = workspaceResponse.body.id;

    const createProject = await request(app.getHttpServer())
      .post(`/workspaces/${workspaceId}/projects`)
      .set('x-user-id', 'user-456')
      .send({
        name: 'Core Project',
        description: 'Initial project',
      })
      .expect(201);

    expect(createProject.body).toMatchObject({
      name: 'Core Project',
      workspaceId,
      description: 'Initial project',
    });

    const projectId = createProject.body.id;

    const updatedProject = await request(app.getHttpServer())
      .patch(`/projects/${projectId}`)
      .set('x-user-id', 'user-456')
      .send({
        name: 'Updated Core Project',
        description: 'Updated description',
      })
      .expect(200);

    expect(updatedProject.body).toMatchObject({
      id: projectId,
      name: 'Updated Core Project',
      description: 'Updated description',
    });

    await request(app.getHttpServer())
      .delete(`/projects/${projectId}`)
      .set('x-user-id', 'user-456')
      .expect(204);

    await request(app.getHttpServer())
      .get(`/projects/${projectId}`)
      .set('x-user-id', 'user-456')
      .expect(404);
  });
});
