import { NextResponse } from 'next/server';
import * as BunnyStorageSDK from "@bunny.net/storage-sdk";

const BUNNY_CDN_STORAGE_ZONE = process.env.BUNNY_CDN_STORAGE_ZONE;
const BUNNY_CDN_API_KEY = process.env.BUNNY_CDN_API_KEY;
const BUNNY_CDN_PULL_ZONE_HOSTNAME = process.env.BUNNY_CDN_PULL_ZONE_HOSTNAME;

export async function GET(request: Request) {
  if (!BUNNY_CDN_STORAGE_ZONE || !BUNNY_CDN_API_KEY || !BUNNY_CDN_PULL_ZONE_HOSTNAME) {
    return NextResponse.json({ error: 'CDN configuration missing from environment variables' }, { status: 500 });
  }

  let sz = BunnyStorageSDK.zone.connect_with_accesskey(
    BunnyStorageSDK.regions.StorageRegion.London,
    BUNNY_CDN_STORAGE_ZONE,
    BUNNY_CDN_API_KEY
  );

  try {
    const files = await BunnyStorageSDK.file.list(sz, '/');

    // Create a list of image files with their display names and full CDN paths
    const imageFiles = files
      .filter(file => !file.isDirectory && /\.(jpg|jpeg|png|gif|svg)$/i.test(file.objectName))
      .map(file => ({
        name: file.objectName,
        path: `https://${BUNNY_CDN_PULL_ZONE_HOSTNAME}/${file.objectName}`
      }));

    return NextResponse.json({
      images: imageFiles,
    });
  } catch (error) {
    console.error('Error fetching images from Bunny CDN:', error);
    return NextResponse.json({ error: 'Failed to fetch files from Bunny CDN' }, { status: 500 });
  }
}