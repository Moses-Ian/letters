module.exports = {
  apps : [{
		name: "letters",
    script: 'server/server.js',
		env_production: {
			 NODE_ENV: "production"
		},
		env_development: {
			 NODE_ENV: "development"
		}
  }]
};
