/**
 * auth.test.ts
 *
 * This file uses Jest and supertest to test authentication endpoints.
 */

import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import your controller functions
import {
  signIn,
  logIn,
  status,
  sendEmail,
  resetPassword,
  deleteUser,
} from '../controller/authentication'; // update the path accordingly

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// Set up routes for testing
app.post('/signin', signIn);
app.post('/login', logIn);
app.get('/status', status);
app.post('/reset-password', sendEmail);
app.put('/reset-password', resetPassword);
app.delete('/delete', deleteUser);

describe('Authentication Endpoints', () => {
  // Test for signIn
  it('should create a new user on signUp', async () => {
    const res = await request(app)
      .post('/signin')
      .send({
        username: 'jestuser',
        email: 'jestuser@example.com',
        password: 'JestPass123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('User create successfully');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  // Test for logIn using email
  it('should login an existing user using email', async () => {
    // First, create a user
    await request(app)
      .post('/signin')
      .send({
        username: 'jestuser2',
        email: 'jestuser2@example.com',
        password: 'JestPass456'
      });
    const res = await request(app)
      .post('/login')
      .send({
        email: 'jestuser2@example.com',
        password: 'JestPass456'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Login in successful');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  // Test for logIn using username
  it('should login an existing user using username', async () => {
    // First, create a user
    await request(app)
      .post('/signin')
      .send({
        username: 'jestuser3',
        email: 'jestuser3@example.com',
        password: 'JestPass789'
      });
    const res = await request(app)
      .post('/login')
      .send({
        username: 'jestuser3',
        password: 'JestPass789'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Login in successful');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  // Test for status (requires authentication)
  it('should return user status when authenticated', async () => {
    // Create a user and obtain cookie from signup
    const signupRes = await request(app)
      .post('/signin')
      .send({
        username: 'jestuser4',
        email: 'jestuser4@example.com',
        password: 'JestPass1234'
      });
    const cookie = signupRes.headers['set-cookie'];
    const res = await request(app)
      .get('/status')
      .set('Cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toHaveProperty('username', 'jestuser4');
    expect(res.body.user).toHaveProperty('email', 'jestuser4@example.com');
  });

  // Test for sendEmail
  it('should send reset email for a valid email', async () => {
    // Create a user first
    await request(app)
      .post('/signin')
      .send({
        username: 'jestuser5',
        email: 'jestuser5@example.com',
        password: 'JestPass567'
      });
    const res = await request(app)
      .post('/reset-password')
      .send({
        email: 'jestuser5@example.com'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Reset password email sent');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  // Test for resetPassword
  it('should reset password for an authenticated user', async () => {
    // Create and log in a user to obtain authentication cookie
    const signupRes = await request(app)
      .post('/signin')
      .send({
        username: 'jestuser6',
        email: 'jestuser6@example.com',
        password: 'JestPass678'
      });
    const cookie = signupRes.headers['set-cookie'];
    const res = await request(app)
      .put('/reset-password')
      .set('Cookie', cookie)
      .send({
        newPassword: 'NewJestPass678'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Password reset successful');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  // Test for deleteUser
  it('should delete all users and tasks', async () => {
    const res = await request(app)
      .delete('/delete')
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('All users deleted successfully');
  });
});

