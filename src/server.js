import buildFastify from './app.js';

const start = async () => {
    try {
        const instance = buildFastify();
        await instance.listen({ port: 3000 });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
