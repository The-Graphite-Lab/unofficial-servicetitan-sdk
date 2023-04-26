const axios = require('axios');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor(appKey, clientId, clientSecret, tenantId, sandbox) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.tenantId = tenantId;
    this.token = null;
    this.tokenExpiration = null;
    this.appKey = appKey;
    this.sandbox = sandbox;
  }

  async authenticate() {
    const url = sandbox ? 'https://auth-integration.servicetitan.io/connect/token' : 'https://auth.servicetitan.io/connect/token'
    const response = await axios.post(url, null, {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    });

    const token = response.data.access_token;
    const decoded = jwt.decode(token);
    this.token = token;
    this.tokenExpiration = decoded.exp * 1000;
  }

  async getToken() {
    const now = Date.now();

    if (!this.token || now >= this.tokenExpiration - (60 * 1000)) {
      await this.authenticate();
    }

    return this.token;
  }

  async getAppKey(){
    return this.appKey
  }

  async getEnvironment(){
    return this.sandbox
  }

  scheduleTokenRefresh() {
    setInterval(async () => {
      await this.authenticate();
    }, 8 * 60 * 1000);
  }
}

module.exports = AuthService;
