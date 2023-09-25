import Image from 'next/image'
import {DrawerDefault} from "@/app/components/DrawerDefault";
import MainMap from "@/app/components/Map/MainMap";
import MainMapDemo from "@/app/components/Map/MainMapDemo";
import MapToggle from "@/app/components/Map/MapToggle";
import MapSwitch from "@/app/components/Map/MapSwitch";

export default function Home() {
  return (
    <main className="relative min-h-screen">
        <MapSwitch />
    </main>
  )
}
