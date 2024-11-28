import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const AXIOS_INSTANCE = axios.create({
  baseURL: "http://localhost:3001/api",
});

interface CustomRequestConfig extends AxiosRequestConfig {
  url: string;
}

export const customInstance = <T>({
  url,
  method,
  params,
  data,
  headers,
}: CustomRequestConfig): Promise<T> => {
  return AXIOS_INSTANCE({
    url,
    method,
    params,
    data,
    headers,
  }).then((response: AxiosResponse<T>) => response.data);
};
