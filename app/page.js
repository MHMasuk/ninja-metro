import Image from 'next/image'
import {DrawerDefault} from "@/app/components/DrawerDefault";
// import MainMap from "@/app/components/Map/MainMap";
// import MainMapDemo from "@/app/components/Map/MainMapDemo";
// import MapToggle from "@/app/components/Map/MapToggle";
import MapSwitch from "@/app/components/Map/MapSwitch";
import MarkerMap from "@/app/components/Map/MarkerMap";
import MapSwitchNew from "@/app/components/Map/MapSwitchNew";
// import HoberMap from "@/app/components/Map/HoberMap";
// import PopupMap from "@/app/components/Map/PopupMap";
// import PopupDemo from "@/app/components/Map/PopupDemo";
// import MapBoxMap from "@/app/components/Map/MapBoxMap";
// import DemoMainMap from "@/app/components/demoApp/DemoMainMap";

export default function Home() {
  return (
    <main className="relative min-h-screen">
    {/*<main>*/}
    {/*    <MapSwitchNew />*/}
        <MapSwitch />
        {/*<MarkerMap />*/}
    </main>
  )
}
