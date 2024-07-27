import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
 
export const GET = async (request: NextRequest, { params }: any) => {
    console.log("params===", params);
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
 
  const response = await fetch(`${process.env.BASE_API_URL}/report/${params?.brand}`, {
    headers: {
      Authorization: `Bearer ${token?.idToken}`,
    },
  });
 
  const data = await response.json();
 
  return Response.json({ ...data });
};