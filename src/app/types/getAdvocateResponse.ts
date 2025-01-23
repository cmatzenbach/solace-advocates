import { Advocate } from "./advocate";

export type GetAdvocatesResponse = {
  data: Advocate[];
  total: number;
  page: number;
  limit: number;
};
