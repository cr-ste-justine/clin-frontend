import Axios from 'axios';
import https from 'https';
import keycloak from '../keycloak';

const secureClinAxios = Axios.create({
  timeout: 15000,
  // withCredentials: true
});
secureClinAxios.defaults.crossdomain = true;
secureClinAxios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${keycloak.token}`;
  config.httpsAgent = new https.Agent({ rejectUnauthorized: false });
  // config.headers['Accept-Language'] = 'fr-CA'
  return config;
});
export default {
  secureClinAxios,
};
