"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StoryBuilder from "../StoryBuilder";

export default function NewStoryPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (storyData) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyData)
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/stories");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Failed to save story");
    } finally {
      setIsSaving(false);
    }
  };

  return <StoryBuilder onSave={handleSave} isSaving={isSaving} />;
}
