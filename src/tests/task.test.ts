/**
 * task.test.ts
 *
 * This file tests the Task endpoints: createTask, getTasks, updateTask, and deleteTask.
 */

import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// Import your task controller functions
import { createTask, getTasks, updateTask, deleteTask } from '../controller/tasks'; // Update the path accordingly

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// For testing purposes, simulate authentication by setting req.userId
app.use((req, res, next) => {
  // In a real scenario, you would verify the token.
  // Here, we simply set req.userId to '1' for testing.
  req.userId = '1';
  next();
});

// Mount the task endpoints
app.post('/create-task', createTask);
app.get('/get-tasks', getTasks);
app.put('/update-task/:id', updateTask);
app.delete('/delete-task/:id', deleteTask);

describe('Task Endpoints', () => {
  let createdTaskId: number;

  // Test createTask endpoint
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/create-task')
      .send({ title: 'Test Task' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('table created successfully');
    expect(res.body.task).toHaveProperty('id');
    createdTaskId = res.body.task.id;
  });

  // Test getTasks endpoint
  it('should get tasks for the authenticated user', async () => {
    const res = await request(app)
      .get('/get-tasks');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // Test updateTask: update title
  it('should update task title', async () => {
    const res = await request(app)
      .put(`/update-task/${createdTaskId}`)
      .send({ title: 'Updated Test Task' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Table updated successfully');
    expect(res.body.updateTable).toHaveProperty('title', 'Updated Test Task');
  });

  // Test updateTask: toggle status (without sending title)
  it('should toggle task status if title is not provided', async () => {
    // First, get the current task status
    const getRes = await request(app).get('/tasks');
    const task = getRes.body.find((t: any) => t.id === createdTaskId);
    const currentStatus = task.status;

    const res = await request(app)
      .put(`/update-task/${createdTaskId}`)
      .send({}); // No title sent, so it should toggle the status
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Table updated successfully');
    expect(res.body.updateTable).toHaveProperty('status', !currentStatus);
  });

  // Test deleteTask endpoint
  it('should delete the task', async () => {
    const res = await request(app)
      .delete(`/delete-task/${createdTaskId}`)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Table deleted successfully');
  });
});


