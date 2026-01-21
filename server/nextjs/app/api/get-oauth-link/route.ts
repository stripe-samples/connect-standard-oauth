import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Generate a random state for CSRF protection
    const state = crypto.randomUUID();

    // Store the state in a cookie for later verification
    const cookieStore = await cookies();
    cookieStore.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
    });

    const args = new URLSearchParams({
      state,
      client_id: process.env.STRIPE_CLIENT_ID!,
      scope: "read_write",
      response_type: "code",
    });

    const url = `https://connect.stripe.com/oauth/authorize?${args.toString()}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error generating OAuth link:", error);
    return NextResponse.json(
      { error: "Failed to generate OAuth link" },
      { status: 500 }
    );
  }
}
