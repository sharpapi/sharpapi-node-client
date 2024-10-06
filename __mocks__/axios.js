const axios = jest.genMockFromModule('axios');

axios.create = jest.fn(() => axios);

axios.get = jest.fn(() => Promise.resolve({ data: {} }));
axios.post = jest.fn(() => Promise.resolve({ data: {} }));

module.exports = axios;

