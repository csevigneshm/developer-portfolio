module.exports = {
  apps: [
    {
      name: 'portfolio-rag-api',
      script: 'start.sh',
      interpreter: 'bash',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
