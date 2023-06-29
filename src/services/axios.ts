import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

client.interceptors.response.use(async (response) => {
  // add artificial delay for dev env
  if (process.env.NODE_ENV === 'development') {
    await sleep(import.meta.env.VITE_AXIOS_DELAY ?? 0)
  }

  return response
})

export default client
