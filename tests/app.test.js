import {
    describe,
    it,
    before,
    after,
    beforeEach,
    afterEach,
    mock,
} from 'node:test';
import assert from 'node:assert';
import buildApp from '../src/app.js';
import nodeMailer from 'nodemailer';

describe('GET /', () => {
    let app;
    const testEnvVars = {
        JWT_SECRET_KEY: 'test_jwt_secret_key',
        EMAIL_HOST: 'smtp.test-email.com',
        EMAIL_USER: 'test_user@test.com',
        EMAIL_PASSWORD: 'test_password_123',
    };
    let emails;

    beforeEach(() => {
        process.env = { ...testEnvVars };
        emails = [];
        mock.method(nodeMailer, 'createTransport', () => {
            return {
                sendMail: function (options, callback) {
                    emails.push(options);
                    callback();
                },
            };
        });
    });

    afterEach(() => {
        process.env = { ...testEnvVars };
        emails = [];
        mock.reset();
    });

    before(async () => {
        app = await buildApp();
    });

    after(async () => {
        await app.close();
    });

    it('should return 404 if email missed in body', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/signup',
        });
        assert.deepStrictEqual(response.statusCode, 404);
        assert.strictEqual(
            response.headers['content-type'],
            'application/json; charset=utf-8'
        );
        assert.deepEqual(JSON.parse(response.payload), {
            message: "You didn't enter a valid email address.",
        });
    });

    it('should return a 500 error if environment variables are not set', async () => {
        delete process.env.EMAIL_HOST;
        const response = await app.inject({
            method: 'POST',
            url: '/signup',
            payload: {
                email: 'test-email@test.com',
            },
        });
        assert.deepStrictEqual(response.statusCode, 500);
        assert.strictEqual(
            response.headers['content-type'],
            'application/json; charset=utf-8'
        );
        assert.deepEqual(JSON.parse(response.payload), {
            message: 'Something went wrong. Please contact administrator.',
        });
    });

    it('should send email with with valid token', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/signup',
            payload: {
                email: 'test-email@test.com',
            },
        });
        assert.deepStrictEqual(response.statusCode, 200);
        assert.strictEqual(
            response.headers['content-type'],
            'application/json; charset=utf-8'
        );
        assert.deepEqual(JSON.parse(response.payload), {
            message: 'Magic link sent.',
        });
        assert.equal(emails.length, 1);
        const tokenRegex = /token=(.+)</;
        const match = emails[0].html.match(tokenRegex);
        const token = match ? match[1] : null;
        assert(token, 'Token should not be empty');
        const accountResponse = await app.inject({
            method: 'GET',
            url: '/account',
            query: {
                token,
            },
        });
        assert.deepStrictEqual(accountResponse.statusCode, 200);
    });
});
