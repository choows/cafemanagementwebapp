const baseURL = process.env.REACT_APP_API_URL; 
const request = async (endpoint, method, body = null, headers = {}) => {
    const url = `${baseURL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers,
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
export const get = (endpoint, params = {}, headers = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const urlWithParams = queryString ? `${endpoint}?${queryString}` : endpoint;
    return request(urlWithParams, 'GET', null, headers);
};

export const post = (endpoint, body, headers = {}) => request(endpoint, 'POST', body, headers);

export const put = (endpoint, body, headers = {}) => request(`${endpoint}`, 'PUT', body, headers);

export const del = (endpoint, id, headers = {}) => request(`${endpoint}?Id=${id}`, 'DELETE', null, headers);