import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Handles POST requests from the Puck editor.
 * It forwards the Puck page data to a separate backend service for database interaction.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const pageData = payload.data;
    const pagePath = payload.path;

    if (!pagePath || !pageData) {
      return NextResponse.json(
        { status: "error", message: "Missing page path or data in request body." },
        { status: 400 }
      );
    }

    const pageRequest = JSON.stringify({ path: pagePath, data: pageData });

    // Make a POST request to your backend service
    const backendResponse = await fetch(`${BACKEND_URL}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: pageRequest,
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({ message: "Unknown backend error" }));
      console.error("Backend failed to save page:", backendResponse.status, errorData);
      return NextResponse.json(
        { status: "error", message: `Backend error: ${errorData.message || backendResponse.statusText}` },
        { status: backendResponse.status }
      );
    }

    const responseBody = await backendResponse.json();

    revalidatePath(pagePath);

    return NextResponse.json({ status: "ok", message: "Page saved successfully via backend", backendResponse: responseBody });

  } catch (error) {
    console.error("Error forwarding save request to backend API:", error);
    return NextResponse.json(
      { status: "error", message: `Failed to connect to backend API: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

/**
 * Handles DELETE requests for deleting Puck page data.
 * This endpoint proxies the request to the C# backend.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pagePath = searchParams.get('path');

    if (!pagePath) {
      return NextResponse.json(
        { status: "error", message: "Page path is missing in the request." },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(`${BACKEND_URL}/pages/${encodeURIComponent(pagePath)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({ message: "Unknown backend error" }));
      console.error("Backend failed to delete page:", backendResponse.status, errorData);
      return NextResponse.json(
        { status: "error", message: `Backend error: ${errorData.message || backendResponse.statusText}` },
        { status: backendResponse.status }
      );
    }
    revalidatePath(pagePath);

    return NextResponse.json({ status: "ok", message: "Page deleted successfully" });

  } catch (error) {
    console.error("Error deleting page via Next.js API route:", error);
    return NextResponse.json(
      { status: "error", message: `Failed to delete page: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

