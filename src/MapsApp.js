import React from "react"
import MapPage from "./pages/MapPage"
import { SocketProvider } from "./context/Context"

const MapsApp = () => {
  return (
    <SocketProvider>
      <MapPage />
    </SocketProvider>
  )
}

export default MapsApp
