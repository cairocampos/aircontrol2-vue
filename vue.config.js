const fs = require('fs');

module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'https://127.0.0.1:9082',
          ws: true,
          changeOrigin: true
        },
        '/sockjs-node': {
          target: 'https://192.168.100.109:8080',
          ws: true,
          changeOrigin: true
        }
      },
      port: '8080',
        https: {
            key: fs.readFileSync('./certs/cert.key'),
            cert: fs.readFileSync('./certs/cert.crt'),
        }              
    },
};