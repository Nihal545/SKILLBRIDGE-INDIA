const http = require('http');

function post(url, data) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const postData = JSON.stringify(data);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        reject({ statusCode: res.statusCode, data: parsed });
                    }
                } catch (e) {
                    reject({ statusCode: res.statusCode, body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function test() {
    try {
        console.log('Testing Registration...');
        const email = 'testclient_script_' + Date.now() + '@example.com';
        const regRes = await post('http://localhost:5000/api/auth/register', {
            name: 'Test Client',
            email: email,
            password: 'Password123!',
            role: 'client'
        });
        console.log('Registration Success:', regRes);

        console.log('\nTesting Login...');
        const loginRes = await post('http://localhost:5000/api/auth/login', {
            email: email,
            password: 'Password123!'
        });
        console.log('Login Success. Token length:', loginRes.token.length);

        console.log('\n--- ALL BACKEND CORE TESTS PASSED ---');
        
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

test();
