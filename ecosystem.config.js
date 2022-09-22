module.exports = {
  apps: [{
    name: "api-3022",
    script: "./dist/main.js",
    watch: ["./dist/main.js"],
    ignore_watch: ['node_modules'],
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
      KAVENEGAR_API_KEY: "6437747A4B38423271357977414A6B6C6B6D484F666B6B584D57445475444538474E6E7777424A784F42633D",
      KAVENEGAR_API_BASE: "https://api.kavenegar.com/v1/",
    }
  }],
  deploy: {
    production: {
      user: "ubuntu",
      host: ['185.226.118.152'],
      key: "C:\\Users\\amkgp\\.ssh\\id_rsa.pub",
      ref: "origin/master",
      repo: "git@github.com:amsunny/salamatful-api.git",
      path: "/var/www/api.salamatful.ir",
      "post-deploy": "npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env production"
    }
  }
}