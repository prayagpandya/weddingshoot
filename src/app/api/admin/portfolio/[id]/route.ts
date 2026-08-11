import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { ObjectId } from "mongodb";
import Category from "@/models/Category";
import { Readable } from "stream";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { bucket } = await connectToDatabase();
    const item = await Portfolio.findById(id);
    
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Delete images from GridFS
    try {
      if (ObjectId.isValid(item.imageId)) {
        await bucket.delete(new ObjectId(item.imageId));
      }
      if (item.galleryImageIds && Array.isArray(item.galleryImageIds)) {
        for (const gid of item.galleryImageIds) {
          if (ObjectId.isValid(gid)) {
            await bucket.delete(new ObjectId(gid));
          }
        }
      }
    } catch (e) {
      console.warn("Could not delete some images from GridFS", e);
    }

    await Portfolio.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE portfolio error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    await connectToDatabase();
    const updated = await Portfolio.findByIdAndUpdate(id, { $set: body }, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH portfolio error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const place = formData.get("place") as string;
    const categoryId = formData.get("categoryId") as string;
    const orientation = (formData.get("orientation") as string) || "auto";
    const image = formData.get("image") as File | null;
    const galleryImages = formData.getAll("galleryImages") as File[];
    const deletedImageIdsStr = formData.get("deletedImageIds") as string;

    const { bucket } = await connectToDatabase();
    const item = await Portfolio.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const category = await Category.findById(categoryId);
    const tag = category ? category.name : "Uncategorized";

    let updatedImageId = item.imageId;
    
    // Replace Cover Image if provided
    if (image && image.size > 0) {
      // Delete old cover
      if (ObjectId.isValid(item.imageId)) {
        try { await bucket.delete(new ObjectId(item.imageId)); } catch(e) { console.warn("Failed to delete old cover", e); }
      }
      // Upload new cover
      const coverBuffer = Buffer.from(await image.arrayBuffer());
      const coverUploadStream = bucket.openUploadStream(image.name, { contentType: image.type });
      updatedImageId = coverUploadStream.id.toString();
      await new Promise((resolve, reject) => {
        Readable.from(coverBuffer).pipe(coverUploadStream).on('error', reject).on('finish', resolve);
      });
    }

    let updatedGalleryIds: string[] = item.galleryImageIds || [];

    // Remove deleted images
    if (deletedImageIdsStr) {
      try {
        const deletedIds = JSON.parse(deletedImageIdsStr) as string[];
        for (const did of deletedIds) {
          if (ObjectId.isValid(did)) {
            try { await bucket.delete(new ObjectId(did)); } catch(e) { console.warn("Failed to delete gallery image", e); }
          }
          updatedGalleryIds = updatedGalleryIds.filter(gid => gid !== did);
        }
      } catch (e) {
        console.error("Error parsing deletedImageIds", e);
      }
    }

    // Add new gallery images
    for (const file of galleryImages) {
      if (file.size === 0) continue;
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileUploadStream = bucket.openUploadStream(file.name, { contentType: file.type });
      updatedGalleryIds.push(fileUploadStream.id.toString());
      await new Promise((resolve, reject) => {
        Readable.from(fileBuffer).pipe(fileUploadStream).on('error', reject).on('finish', resolve);
      });
    }

    const updated = await Portfolio.findByIdAndUpdate(id, {
      title,
      place,
      tag,
      categoryId,
      orientation,
      imageId: updatedImageId,
      galleryImageIds: updatedGalleryIds
    }, { new: true });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT portfolio error:", error);
    return NextResponse.json({ error: "Failed to edit portfolio item" }, { status: 500 });
  }
}
