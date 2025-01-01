import React, { useState } from "react";
import { slugify } from "@/lib/utils/textConverter";

const ShowTags = ({ tags }: { tags: string[] }) => {
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(window.location.search)
  );
  const selectedTag = searchParams.get("t");

  const updateSearchParams = (newParams: URLSearchParams) => {
    const newParamsString = newParams.toString();
    const newURL = newParamsString
      ? `/productos?${newParamsString}`
      : "/productos";

    window.location.href = newURL.toString();
    setSearchParams(newParams);
  };

  const handleTagClick = (name: string) => {
    const slugName = slugify(name.toLowerCase());
    const newParams = new URLSearchParams(searchParams.toString());

    if (slugName === selectedTag) {
      newParams.delete("t");
    } else {
      newParams.set("t", slugName);
    }

    updateSearchParams(newParams);
  };

  return (
    <button className="flex flex-wrap gap-3">
      {tags.map((tag) => (
        <p
          key={tag}
          className={`px-2 py-1 rounded-md border border-border dark:border-light text-light dark:text-darkmode-light ${selectedTag === slugify(tag.toLowerCase()) &&
            "bg-theme-light dark:bg-theme-dark"
            }`}
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </p>
      ))}
    </button>
  );
};

export default ShowTags;
