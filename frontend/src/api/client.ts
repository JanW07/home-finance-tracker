import axios, { AxiosError } from 'axios';

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
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<SpringErrorResponse>) => {
    let customError: ApiError;

    if (error.response) {
      const springError = error.response.data;
      const status = error.response.status;

      const message =
        springError && springError.message
          ? springError.message
          : 'Wystąpił błąd podczas przetwarzania żądania.';

      customError = {
        message,
        status,
      };
    } else if (error.request) {
      customError = {
        message: 'Network error — is the backend running?',
      };
    } else {
      customError = {
        message: error.message || 'An unexpected error occurred.',
      };
    }

    return Promise.reject(customError);
  }
);

export default apiClient;