// lib/get-page.ts (Backend Proxy)

import type { Data } from '@measured/puck';

const BACKEND_API_FETCH_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetches Puck page data from a separate backend service.
 * @param path The path of the page (e.g., "/", "/about").
 * @returns The page data as a Data object, or null if not found or an error occurs.
 */
export async function getPage(path: string): Promise<Data | null> {
  try {
   
    // Make a GET request to your backend service
    const backendResponse = await fetch(`${BACKEND_API_FETCH_URL}/pages?path=${encodeURIComponent(path)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store' // Ensure fresh data is fetched for SSR/SSG contexts
    });

    if (backendResponse.status === 404) {
      return null; // Page not found
    }

    if (!backendResponse.ok) {
      // Handle other backend errors (e.g., 400, 500)
      const errorData = await backendResponse.json().catch(() => ({ message: "Unknown backend error" }));
      console.error("Backend failed to fetch page:", backendResponse.status, errorData);
      return null;
    }

    // Parse the JSON string received from the C# backend into a Puck 'Data' object
    const pageData: Data = await backendResponse.json();
    return pageData;

  } catch (error) {
    console.error("Error forwarding fetch request to backend API:", error);
    return null; // Return null on network errors or other issues
  }
}
