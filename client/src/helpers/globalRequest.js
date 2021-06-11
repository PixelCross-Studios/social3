import axios from 'axios';

export function getImages(count = 100) {
  return axios.get('/api/images', {
    params: {
      count
    }
  }).then((response) => response.data);
}

export function anotherRequest() {}
