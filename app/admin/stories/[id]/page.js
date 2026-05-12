"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import StoryBuilder from "../StoryBuilder";

export default function EditStoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      const res = await fetch(`/api/stories/${id}`);
      const data = await res.json();
      setStory(data);
    } catch (error) {
      console.error("Failed to fetch story:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (storyData) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: "PUT",
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

  if (loading) return <div className="p-20 text-center">Loading Story...</div>;

  return <StoryBuilder initialData={story} onSave={handleSave} isSaving={isSaving} />;
}
