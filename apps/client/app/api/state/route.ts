import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `${process.env.COUNTRY_STATE_ENDPOINT}=in`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.COUNTRY_STATE_API_KEY!,
        "x-rapidapi-host": "country-state-city-search-rest-api.p.rapidapi.com",
      },
    });

    const data = await res.json();
    return NextResponse.json({ states: data }, { status: 200 });
  } catch (error) {
    console.error("RapidAPI Failed", error);
    return NextResponse.json({ error: "API Failed" }, { status: 500 });
  }
}
