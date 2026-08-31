/**
 * FILE: backend/gateway/tests/gateway.test.js
 * PURPOSE: Core logic and configuration for gateway.test.js.
 */
import request from 'supertest';
import app from '../index.js';

describe('Gateway API Endpoints', () => {
    it('should return 200 OK from the health check endpoint', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello from Gateway');
    });

    it('should apply rate limiting headers', async () => {
        const response = await request(app).get('/');
        expect(response.headers['x-ratelimit-limit']).toBeDefined();
        expect(response.headers['x-ratelimit-remaining']).toBeDefined();
    });
});
