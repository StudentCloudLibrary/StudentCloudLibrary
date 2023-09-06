import axios from 'axios';

export function createContainer(dataToSubmit) {

    const request = axios.post('/api/docker/v1/ssh-create',dataToSubmit)
    .then(response => response.data )

    return {
        payload: request
    }
}

export function startContainer(dataToSubmit) {
    const request = axios.post('/api/docker/v1/ssh-start',dataToSubmit)
    .then(response => response.data);

    return {
        payload: request
    }
}
export function stopContainer(dataToSubmit) {
    const request = axios.post('/api/docker/v1/ssh-stop',dataToSubmit)
    .then(response => response.data);

    return {
        payload: request
    }
}
export function connectContainer(dataToSubmit) {
    const request = axios.post('/api/docker/v1/ssh-connect',dataToSubmit)
    .then(response => response.data);

    return {
        payload: request
    }
}