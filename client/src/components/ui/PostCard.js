import React from "react";
import { useState } from "react";
import { Rating, Menu, MenuDivider, Text } from "@mantine/core";
import { Star1, Edit2, Trash, More } from "iconsax-react";

function relativeTime(iso, fallback) {
  if (!iso) return fallback ?? "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return fallback ?? iso;

  const diff = Math.max(0, Date.now() - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 10) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(then).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function PostCard() {
  const [editing, setEditing] = useState(false);
  return (
    <div
      id="post-card"
      className="bg-[#10100E] border border-[#925FF0BF] rounded-2xl p-4 font-light flex flex-row gap-2"
    >
      <div className="w-14 h-14 rounded-full object-cover shrink-0 bg-white"></div>
      <div className="ml-5 flex-1">
        <div
          id="pc-header"
          className="flex flex-row gap-1 space-x-1.5 content-center"
        >
          <p className="text-md font-extralight">
            {" "}
            @username ·{" "}
            {/* <span className="text-gray-500 text-[4px] font-extralight italic">
											{relativeTime(post.created_at_iso, post.created_at)}
										</span> */}
          </p>
        </div>
        <div className="flex flex-row gap-4 mt-3 items-start">
          <div>
            <div className="w-50 h-50 rounded-lg object-cover shrink-0 bg-white"></div>
          </div>
          <div className="flex flex-col flex-1 min-w-0 gap-0.5">
            <h4 className="text-2xl font-medium text-white leading-tight">
              title
            </h4>
            <h5 className="text-xl text-gray-400 font-light">artist name</h5>
            <Rating
              readOnly // {!editing}
              count={5}
              emptySymbol={<Star1 size={20} variant="Broken" color="#925EF0" />}
              fullSymbol={<Star1 size={20} variant="Bold" color="#925EF0" />}
            />
            <p className="mt-1">
              Pariatur ex dolore excepteur nulla. Nulla eu deserunt duis eu
              aliqua duis esse officia mollit cupidatat veniam incididunt sunt
              elit. Minim consectetur pariatur sit deserunt mollit. Do quis
              eiusmod quis exercitation labore eiusmod fugiat dolor eiusmod
              labore amet.
            </p>
          </div>
        </div>
      </div>
      <Menu shadow="md">
        <Menu.Target>
          <More size={22} color="white" className="rotate-90" />
        </Menu.Target>
        <Menu.Dropdown className="flex flex-col m-1">
          <div className="ml-2 gap-3 items-center">
            {editing ? (
              <>
                <button
                  //onClick={() => doUpdate()}
                  className="text-xs text-[#925FF0] hover:text-[#E9DFFC] m-1"
                >
                  save
                </button>
                <button
                  // onClick={() => {
                  // 	setDraft(post.content);
                  // 	setRatingDraft(post.rating ?? 0);
                  // 	setEventDraft(post.event ?? {});
                  // 	setEditing(false);
                  // }}
                  className="text-xs text-gray-400 hover:text-white m-2"
                >
                  cancel
                </button>
              </>
            ) : (
              <Menu.Item
                onClick={() => setEditing(true)}
                leftSection={<Edit2 size={18} color="black" variant="Broken" />}
                className="m-1"
              >
                <Text size="md" m="1" className="text-black">
                  Edit
                </Text>
              </Menu.Item>
            )}
            <MenuDivider />
            <Menu.Item
              //onClick={confirmDelete}
              leftSection={<Trash size={18} color="#D64751" variant="Broken" />}
              className="m-1"
            >
              <Text size="md" m="1" className="text-black">
                Delete
              </Text>
            </Menu.Item>
          </div>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

export default PostCard;
