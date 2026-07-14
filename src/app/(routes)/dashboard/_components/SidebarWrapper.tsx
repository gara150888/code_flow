"use client";

import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/app/(routes)/_components/Sidebar"), {
    ssr: false,
});

export default Sidebar;