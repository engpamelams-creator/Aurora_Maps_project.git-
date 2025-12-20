import net from 'node:net';

const LOCAL_PORT = 5433;
const REMOTE_HOST = 'aws-0-sa-east-1.pooler.supabase.com';
const REMOTE_PORT = 5432;

const server = net.createServer((socket) => {
    console.log(`[${new Date().toISOString()}] New Connection`);

    const client = net.createConnection(REMOTE_PORT, REMOTE_HOST, () => {
        socket.pipe(client);
        client.pipe(socket);
    });

    client.on('error', (err) => {
        console.error('Remote Error:', err.message);
        socket.end();
    });

    socket.on('error', (err) => {
        console.error('Local Error:', err.message);
        client.end();
    });
});

server.listen(LOCAL_PORT, () => {
    console.log(`✨ Magic Tunnel Running: localhost:${LOCAL_PORT} -> ${REMOTE_HOST}:${REMOTE_PORT}`);
});
