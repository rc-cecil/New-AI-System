import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

type Workspace = {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
};

type Project = {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
};

const workspaces = new Map<string, Workspace>();
const projects = new Map<string, Project>();

function getUserId(req: any): string {
  const userId = req.headers['x-user-id'];
  if (!userId || typeof userId !== 'string') {
    throw new UnauthorizedException('Missing x-user-id header');
  }
  return userId;
}

@Controller()
export class WorkspaceProjectController {
  @Post('workspaces')
  createWorkspace(@Req() req: any, @Body() body: { name: string; slug: string }) {
    const ownerId = getUserId(req);
    const workspace: Workspace = {
      id: `ws_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      name: body.name,
      slug: body.slug,
      ownerId,
    };
    workspaces.set(workspace.id, workspace);
    return {
      ...workspace,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  @Get('workspaces')
  listWorkspaces(@Req() req: any) {
    const ownerId = getUserId(req);
    const items = Array.from(workspaces.values()).filter((workspace) => workspace.ownerId === ownerId);
    return { items };
  }

  @Post('workspaces/:workspaceId/projects')
  createProject(
    @Req() req: any,
    @Param('workspaceId') workspaceId: string,
    @Body() body: { name: string; description?: string },
  ) {
    const ownerId = getUserId(req);
    const workspace = workspaces.get(workspaceId);
    if (!workspace || workspace.ownerId !== ownerId) {
      throw new UnauthorizedException('Workspace not found or not accessible');
    }

    const project: Project = {
      id: `proj_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      name: body.name,
      description: body.description,
      workspaceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.set(project.id, project);
    return project;
  }

  @Get('projects/:projectId')
  getProject(@Req() req: any, @Param('projectId') projectId: string) {
    const ownerId = getUserId(req);
    const project = projects.get(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const workspace = workspaces.get(project.workspaceId);
    if (!workspace || workspace.ownerId !== ownerId) {
      throw new UnauthorizedException('Project not found or not accessible');
    }
    return project;
  }

  @Patch('projects/:projectId')
  updateProject(
    @Req() req: any,
    @Param('projectId') projectId: string,
    @Body() body: { name?: string; description?: string },
  ) {
    const ownerId = getUserId(req);
    const project = projects.get(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const workspace = workspaces.get(project.workspaceId);
    if (!workspace || workspace.ownerId !== ownerId) {
      throw new UnauthorizedException('Project not found or not accessible');
    }

    const nextProject: Project = {
      ...project,
      name: body.name ?? project.name,
      description: body.description ?? project.description,
      updatedAt: new Date().toISOString(),
    };
    projects.set(projectId, nextProject);
    return nextProject;
  }

  @Delete('projects/:projectId')
  @Header('Content-Type', 'application/json')
  deleteProject(@Req() req: any, @Param('projectId') projectId: string, @Res() res: Response) {
    const ownerId = getUserId(req);
    const project = projects.get(projectId);
    if (!project) {
      res.status(404).send({ message: 'Project not found' });
      return;
    }
    const workspace = workspaces.get(project.workspaceId);
    if (!workspace || workspace.ownerId !== ownerId) {
      throw new UnauthorizedException('Project not found or not accessible');
    }

    projects.delete(projectId);
    res.status(204).send();
  }
}
