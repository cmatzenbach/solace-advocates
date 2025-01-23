import { GetAdvocatesResponse } from "../types/getAdvocateResponse";

export const fetchAdvocates = async (
  page: number = 1,
  limit: number = 20,
  search: string = ""
): Promise<GetAdvocatesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search && search !== "") {
    params.append("search", search);
  }
  console.log(params.toString());

  const response = await fetch(`/api/advocates?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch advocates, is postgres running?");
  }

  const data: GetAdvocatesResponse = await response.json();
  return data;
};
