import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { Readable } from "stream";
import Category from "@/models/Category"; // ensure model is registered

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    // Populate category to get the name if needed, but we also save 'tag'
    const items = await Portfolio.find({}).populate('categoryId').sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET portfolio error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const place = formData.get("place") as string;
    const categoryId = formData.get("categoryId") as string;
    const image = formData.get("image") as File;
    const galleryImages = formData.getAll("galleryImages") as File[];
    const orientation = (formData.get("orientation") as string) || "auto";

    if (!title || !place || !categoryId || !image) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const { bucket } = await connectToDatabase();

    // Get category name for the 'tag' field
    const category = await Category.findById(categoryId);
    const tag = category ? category.name : "Uncategorized";

    // Upload Cover Image
    const coverArrayBuffer = await image.arrayBuffer();
    const coverBuffer = Buffer.from(coverArrayBuffer);
    const coverStream = Readable.from(coverBuffer);

    const coverUploadStream = bucket.openUploadStream(image.name, {
      contentType: image.type,
    });
    const imageId = coverUploadStream.id.toString();

    await new Promise((resolve, reject) => {
      coverStream.pipe(coverUploadStream)
        .on('error', reject)
        .on('finish', resolve);
    });

    // Upload Gallery Images
    const galleryImageIds: string[] = [];
    for (const file of galleryImages) {
      if (file.size === 0) continue; // Skip empty files
      const fileArrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(fileArrayBuffer);
      const fileStream = Readable.from(fileBuffer);
      
      const fileUploadStream = bucket.openUploadStream(file.name, {
        contentType: file.type,
      });
      galleryImageIds.push(fileUploadStream.id.toString());
      
      await new Promise((resolve, reject) => {
        fileStream.pipe(fileUploadStream)
          .on('error', reject)
          .on('finish', resolve);
      });
    }

    const portfolioItem = await Portfolio.create({
      title,
      place,
      tag,
      categoryId,
      imageId,
      galleryImageIds,
      orientation,
    });

    return NextResponse.json(portfolioItem, { status: 201 });
  } catch (error) {
    console.error("POST portfolio error:", error);
    return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 });
  }
}
