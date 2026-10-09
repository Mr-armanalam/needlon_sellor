"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
);

export default function ProductUpload() {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [modalImages, setModalImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpload() {
    if (!mainImage) return alert("Please select a main image");
    setLoading(true);

    // ---------- Upload Main Image ----------
    const mainPath = `products/${Date.now()}_${mainImage.name}`;
    const { data: mainData, error: mainError } = await supabase.storage
      .from("product-images")
      .upload(mainPath, mainImage);

    if (mainError) {
      console.error(mainError.message);
      setLoading(false);
      return;
    }

    const mainUrl = supabase.storage
      .from("product-images")
      .getPublicUrl(mainData!.path).data.publicUrl;


    // ---------- Upload Modal Images ----------
    const modalUrls: string[] = [];
    for (const file of modalImages) {
      const path = `products/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(path, file);
      if (!error) {
        const url = supabase.storage
          .from("product-images")
          .getPublicUrl(data!.path).data.publicUrl;
        modalUrls.push(url);
      }else{
        console.log('something ', error.message);
        
      }
    }

    // console.log(mainUrl, modalUrls, 'modalurl');
    

    // ---------- Insert into Postgres via API ----------
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "outerwears",
        CatType: "Women",
        SubCatType: "Coat",
        name: "Tailored grey men's Shirt",
        price: 1299.99,
        sizes: ["S", "M", "L", "XL"],
        quantity: 5,
        image: mainUrl,
        modalImage: modalUrls,
        material: 'Silk'
      }),
    });

    setLoading(false);
    if (res.ok) {
      alert("Product uploaded successfully!");
      router.refresh();
    } else {
      alert("Failed to save product");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Add Product</h2>

      {/* Main Image */}
      <Card className="p-4">
        <p className="font-medium mb-2">Main Image</p>
        <label
          className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
        >
          <UploadCloud className="h-10 w-10 text-gray-500" />
          <p className="text-gray-500 text-sm">Drag & Drop or Click to Upload</p>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => setMainImage(e.target.files?.[0] || null)}
          />
        </label>
        {mainImage && (
          <img
            src={URL.createObjectURL(mainImage)}
            alt="preview"
            className="mt-4 rounded-lg w-40"
          />
        )}
      </Card>

      {/* Modal Images */}
      <Card className="p-4">
        <p className="font-medium mb-2">Modal Images</p>
        <label
          className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
        >
          <ImageIcon className="h-10 w-10 text-gray-500" />
          <p className="text-gray-500 text-sm">Drag & Drop or Select Multiple</p>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={(e) => setModalImages(Array.from(e.target.files || []))}
          />
        </label>
        <div className="flex flex-wrap gap-3 mt-4">
          {modalImages.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(img)}
                alt="modal"
                className="rounded-lg w-28 h-28 object-cover"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                onClick={() =>
                  setModalImages((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Button
        disabled={loading}
        onClick={handleUpload}
        className="w-full py-3 rounded-xl"
      >
        {loading ? "Uploading..." : "Save Product"}
      </Button>
    </div>
  );
}
