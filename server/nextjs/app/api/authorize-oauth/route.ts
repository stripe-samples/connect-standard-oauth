import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // Verify the state matches the one we stored
  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;

  if (!storedState || storedState !== state) {
    return NextResponse.json(
      { error: "Incorrect state parameter: " + state },
      { status: 403 }
    );
  }

  // Clear the state cookie
  cookieStore.delete("oauth_state");

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  try {
    // Exchange the authorization code for access token
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    const connectedAccountId = response.stripe_user_id;
    saveAccountId(connectedAccountId!);

    // Redirect to success page
    return NextResponse.redirect(new URL("/success", request.url));
  } catch (error: unknown) {
    const stripeError = error as { type?: string };
    if (stripeError.type === "StripeInvalidGrantError") {
      return NextResponse.json(
        { error: "Invalid authorization code: " + code },
        { status: 400 }
      );
    }
    console.error("OAuth error:", error);
    return NextResponse.json(
      { error: "An unknown error occurred." },
      { status: 500 }
    );
  }
}

function saveAccountId(id: string) {
  // Save the connected account ID from the response to your database.
  console.log("Connected account ID: " + id);
}
