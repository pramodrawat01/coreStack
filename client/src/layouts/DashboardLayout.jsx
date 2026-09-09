// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/dashboard/Sidebar";
// import Topbar from "../components/dashboard/Topbar";

// export default function DashboardLayout(){
//     return(
//         <div className="min-h-screen bg-ink text-white flex border">
//             <Sidebar/>
//             <div className="flex-1 min-w-0 flex flex-col">
//                 <Topbar />
//                 <main className="flex-1 px-6 py-6 overflow-y-auto">
//                 <Outlet />
//                 </main>
//             </div>
//         </div>
//     )
// }   

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen bg-ink text-white flex overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* RIGHT SIDE */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* TOPBAR */}
        <Topbar />

        {/* ONLY OUTLET SCROLLS */}
        <main className="flex-1 min-h-0 px-6 py-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}