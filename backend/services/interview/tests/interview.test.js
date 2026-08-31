/**
 * FILE: backend/services/interview/tests/interview.test.js
 * PURPOSE: Core logic and configuration for interview.test.js.
 */
import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// We will use Supertest to hit the live app endpoints in memory.
// This tests the real routes and controller logic.

describe('Interview Service Integration Tests', () => {
    
    // Connect to database before all tests
    beforeAll(async () => {
        // Connect to MongoDB if not already connected by the app
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URL);
        }
    }, 15000);

    // Close database connection after all tests
    afterAll(async () => {
        await mongoose.connection.close();
        
        // Also disconnect Redis if imported in the app
        const redisModule = await import('../../../shared/redis/redis.js');
        if (redisModule.default && typeof redisModule.default.quit === 'function') {
            await redisModule.default.quit();
        }
    }, 15000);

    it('should return 200 OK from the health check endpoint', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello from Interview-service');
    });

    it('should reject interview start without valid role and type', async () => {
        const response = await request(app)
            .post('/start')
            .set('x-user-id', '64b5f9a91234567890abcdef')
            .send({}); // Missing payload

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Interview type and role are required");
    });
    
    it('should fetch interview stats for a user successfully', async () => {
        const response = await request(app)
            .get('/all')
            .set('x-user-id', '64b5f9a91234567890abcdef');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('stats');
        expect(response.body).toHaveProperty('interviews');
        expect(Array.isArray(response.body.interviews)).toBe(true);
    }, 15000);
});
