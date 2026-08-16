import axios, { AxiosError, type AxiosResponse } from 'axios';

interface SpringErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<SpringErrorResponse>) => {
    let customError: ApiError;

    if (error.response) {
      const springError = error.response.data;
      const status = error.response.status;

      const message =
        springError && springError.message
          ? springError.message
          : 'Wystąpił błąd podczas przetwarzania żądania.';

      customError = { message, status };
    } else if (error.request) {
      customError = {
        message: 'Błąd sieci — czy serwer backendowy działa?',
      };
    } else {
      customError = {
        message: error.message || 'Wystąpił nieoczekiwany błąd.',
      };
    }

    return Promise.reject(customError);
  }
);

export default apiClient;