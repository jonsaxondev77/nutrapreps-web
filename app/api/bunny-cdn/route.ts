// app/api/bunny-cdn/route.ts

import { NextResponse } from 'next/server';
import * as BunnyStorageSDK from "@bunny.net/storage-sdk";

const API_STORAGE_KEY = process.env.BUNNY_CDN_STORAGE_API_KEY;
const STORAGE_ZONE_NAME = process.env.BUNNY_CDN_STORAGE_ZONE_NAME;

// Connect to the storage zone once. The region is hardcoded for this example but can be an environment variable.
let sz = BunnyStorageSDK.zone.connect_with_accesskey(
    BunnyStorageSDK.regions.StorageRegion.London,
    STORAGE_ZONE_NAME,
    API_STORAGE_KEY
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const rawPath = searchParams.get('path') || '/';

        // Clean and format the path for BunnyCDN API
        let apiPath = rawPath;
        
        if (apiPath === '/') {
            apiPath = ''; // Root directory
        } else {
            // Remove leading slash but KEEP trailing slash for directories
            apiPath = apiPath.replace(/^\//, '');
            // For directories, ensure there's a trailing slash
            if (!apiPath.endsWith('/')) {
                apiPath += '/';
            }
        }

        const response = await fetch(
            `https://uk.storage.bunnycdn.com/nutrapreps-storage/${apiPath}`,
            {
                method: 'GET',
                headers: {
                    'AccessKey': process.env.BUNNY_CDN_STORAGE_API_KEY!
                }
            }
        );

        if (!response.ok) {
            console.error('BunnyCDN API error:', response.status, response.statusText);
            throw new Error(`API error: ${response.status}`);
        }

        const files = await response.json();
        
        // Process and clean each file
        const processedFiles = files.map(file => {
            const cleanPath = file.Path.replace('/nutrapreps-storage', '') || '/';
            const isDirectory = file.IsDirectory;
            
            return {
                ...file,
                Path: cleanPath,
                FullPath: cleanPath + (file.ObjectName || '') + (isDirectory ? '/' : ''),
                Name: file.ObjectName || '',
                Type: isDirectory ? 'directory' : 'file',
                Extension: isDirectory ? '' : (file.ObjectName?.split('.').pop() || ''),
                Size: file.Length || 0,
                LastModified: file.LastChanged || file.DateCreated
            };
        });

        // Sorting
        processedFiles.sort((a, b) => {
            if (a.IsDirectory && !b.IsDirectory) return -1;
            if (!a.IsDirectory && b.IsDirectory) return 1;
            return a.ObjectName.localeCompare(b.ObjectName);
        });

        return NextResponse.json(processedFiles);

    } catch (error) {
        console.error('Error listing files:', error);
        return NextResponse.json({ 
            error: 'Failed to list files',
            details: error.message 
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const path = formData.get('path') as string;

        if (!file || !path) {
            return NextResponse.json({ error: 'File and path are required' }, { status: 400 });
        }

        let cleanPath = path.replace('/nutrapreps-storage', '');
        if (!cleanPath.endsWith('/') && cleanPath !== '') {
            cleanPath += '/';
        }
        
        // Use ArrayBuffer instead of converting to Buffer
        const arrayBuffer = await file.arrayBuffer();

        const uploadPath = `${cleanPath}${file.name}`;
        const apiUrl = `https://uk.storage.bunnycdn.com/nutrapreps-storage/${uploadPath}`;

        const uploadResponse = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'AccessKey': process.env.BUNNY_CDN_STORAGE_API_KEY!,
                'Content-Type': 'application/octet-stream',
            },
            body: arrayBuffer,
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Upload failed:', uploadResponse.status, errorText);
            throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
        }

        const fileUrl = `https://nutrapreps.b-cdn.net${cleanPath}${file.name}`;

        return NextResponse.json({ 
            url: fileUrl,
            success: true,
            message: 'File uploaded successfully'
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ 
            error: 'Failed to upload file',
            details: error.message 
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!API_STORAGE_KEY || !STORAGE_ZONE_NAME) {
        return NextResponse.json({ error: 'CDN configuration missing' }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const path = searchParams.get('path');

        if (!path) {
            return NextResponse.json({ error: 'Path is required' }, { status: 400 });
        }
        
        let cleanPath = path.replace(`/${STORAGE_ZONE_NAME}`, '').replace(/^\//, '');

        const deleteResponse = await fetch(
            `https://uk.storage.bunnycdn.com/${STORAGE_ZONE_NAME}/${cleanPath}`,
            {
                method: 'DELETE',
                headers: {
                    'AccessKey': API_STORAGE_KEY!
                }
            }
        );

        if (!deleteResponse.ok) {
             const errorText = await deleteResponse.text();
             console.error('Deletion failed:', deleteResponse.status, errorText);
             throw new Error(`Deletion failed: ${deleteResponse.status} - ${errorText}`);
        }

        return NextResponse.json({ success: true, message: 'File or folder deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting file:', error);
        return NextResponse.json({ error: 'Failed to delete file or folder', details: error.message }, { status: 500 });
    }
}