import Fastify from 'fastify';
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';

const makeToken = (email) => {
    return jwt.sign(
        {
            email,
            expirationDate: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        process.env.JWT_SECRET_KEY
    );
};

const emailTemplate = ({ username, link }) => `
  <h2>Hey ${username}</h2>
  <p>Here's the login link you just requested:</p>
  <p>${link}</p>
`;

const isAuthenticated = (req, res) => {
    const { token } = req.query;
    if (!token) {
        res.status(403);
        return res.send("Can't verify user.");
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        res.status(403);
        return res.send('Invalid auth credentials.');
    }
    if (
        !decoded.hasOwnProperty('email') ||
        !decoded.hasOwnProperty('expirationDate')
    ) {
        res.status(403);
        return res.send('Invalid auth credentials.');
    }
    const { expirationDate } = decoded;
    if (expirationDate < Math.floor(Date.now() / 1000)) {
        res.status(403);
        return res.send('Token has expired.');
    }
    res.status(200);
    return res.send('User has been validated.');
};

function buildFastify() {
    const fastify = Fastify({
        logger: true,
    });

    fastify.post('/signup', function (request, reply) {
        const { email } = request.body || {};
        if (!email) {
            reply.status(404);
            return reply.send({
                message: "You didn't enter a valid email address.",
            });
        }

        if (
            process.env.EMAIL_HOST &&
            process.env.EMAIL_USER &&
            process.env.EMAIL_PASSWORD
        ) {
            const token = makeToken(email);
            const mailOptions = {
                from: 'You Know',
                html: emailTemplate({
                    email,
                    link: `http://localhost:8080/account?token=${token}`,
                }),
                subject: 'Your Magic Link',
                to: email,
            };

            const transport = nodeMailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: 587,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            return transport.sendMail(mailOptions, (error) => {
                if (error) {
                    reply.status(404);
                    reply.send({
                        message: "Can't send email.",
                    });
                } else {
                    reply.status(200);
                    reply.send({
                        message: 'Magic link sent.',
                    });
                }
            });
        } else {
            reply.status(500);
            return reply.send({
                message: 'Something went wrong. Please contact administrator.',
            });
        }
    });

    fastify.get('/account', (req, res) => {
        return isAuthenticated(req, res);
    });

    return fastify;
}

export default buildFastify;
