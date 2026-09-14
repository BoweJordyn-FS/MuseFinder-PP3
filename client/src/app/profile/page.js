"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Progress, Rating } from "@mantine/core";
import PostCard from "@/components/ui/PostCard";
import { useAuth } from "@/context/AuthContext";
import "@mantine/core/styles/Tabs.css";

function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Wait for /me before deciding: until then `user` is null even for
  // someone who is logged in.
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <main className="grid grid-cols-1 lg:grid-cols-[20rem_1fr] gap-10 px-10 pb-10">
      <aside id="banner">
        <div className="bg-[#925FF0] text-center text-black rounded-xl p-8 lg:sticky lg:top-10">
          <div className="bg-amber-50 rounded-full w-48 h-48 mx-auto mb-6" />
          <section className="mb-6">
            <h2 className="text-2xl font-medium">{user.username}</h2>
            <h4 className="text-lg opacity-80">{user.email}</h4>
          </section>
          <section>
            <p className="leading-relaxed">
              Mollit ea dolor in enim esse officia reprehenderit ut et
              reprehenderit sit occaecat anim. Sint labore consectetur cillum
              aliquip quis ipsum adipisicing Lorem tempor elit veniam deserunt
              in.
            </p>
          </section>

          <button className="bg-[#10100E] text-white rounded-md px-10 py-2 mt-8 transition-colors hover:bg-[#E9DFFC] hover:text-[#925FF0]">
            Edit Profile
          </button>
        </div>
      </aside>

      <section className="min-w-0">
        <Tabs defaultValue="profile" color="violet" variant="pills" radius="xl">
          <Tabs.List className="font-bold text-lg">
            <Tabs.Tab value="profile">Profile</Tabs.Tab>
            <Tabs.Tab value="playlists">Playlists</Tabs.Tab>
          </Tabs.List>
          <hr className="my-6 h-px border-0 bg-linear-to-r from-transparent via-[#925FF0]/75 to-transparent" />
          {/* PROFILE PANEL */}
          <Tabs.Panel value="profile" className="flex flex-col gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <PostCard key={index} />
            ))}
          </Tabs.Panel>

          <Tabs.Panel value="playlists">
            <p>Playlists content goes here.</p>
          </Tabs.Panel>
        </Tabs>
      </section>
    </main>
  );
}

export default Profile;
