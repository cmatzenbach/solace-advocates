import { sql } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest, NextResponse } from "next/server";
import { GetAdvocatesResponse } from "../../types/getAdvocateResponse";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "20", 10);
  const search = url.searchParams.get("search")?.toLowerCase() || "";

  const offset = (page - 1) * limit;

  // create array of all table fields that can be searched by
  // the specialty column is titled payload in table, so manually define
  // coherce years of experience and phone number to strings in order to search by
  const searchableFields = [
    advocates.firstName,
    advocates.lastName,
    advocates.city,
    advocates.degree,
    sql`advocates.payload::text`,
    sql`${advocates.yearsOfExperience}::text`,
    sql`${advocates.phoneNumber}::text`,
  ];

  // construct ILIKE and OR statements
  const searchCondition = searchableFields
    .map((field) => sql`${field} ILIKE ${`%${search}%`}`)
    .reduce(
      (acc, condition) => (acc ? sql`${acc} OR ${condition}` : condition),
      null
    );

  // build the main query
  let query = db.select().from(advocates).limit(limit).offset(offset);
  if (searchCondition) {
    query = query.where(searchCondition);
  }

  const data = await query;

  // build count query to get totals
  const totalQuery = db
    .select({ count: sql<number>`COUNT(*)` })
    .from(advocates)
    .where(searchCondition);

  const totalResult = await totalQuery;
  const total = totalResult[0]?.count || 0;

  const response: GetAdvocatesResponse = {
    data,
    total,
    page,
    limit,
  };

  return NextResponse.json(response);
};
