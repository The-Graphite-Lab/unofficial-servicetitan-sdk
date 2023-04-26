const axios = require('axios');
const AuthService = require('./auth');

class servicetitan {
  constructor(appKey, clientId, clientSecret, tenantId, sandbox) {
    this.authService = new AuthService(appKey, clientId, clientSecret, tenantId, sandbox);
    this.authService.scheduleTokenRefresh();
  }

  async getCustomers() {
    const token = await this.authService.getToken();
    const baseUrl = sandbox ? 'api-integration.servicetitan.io' : 'api.servicetitan.io'
    const headers = {
      'Authorization': `Bearer ${token}`,
      'ST-App-Key': appKey,
      'Content-Type': 'application/json'
    };

    const path = `/crm/v2/tenant/${tenantId}/customers`

    const response = await axios({
         url: `${baseUrl}${path}`, 
         method: 'GET', 
         data: {}, 
         headers 
    });
    return response.data;
  }
}

module.exports = servicetitan;
