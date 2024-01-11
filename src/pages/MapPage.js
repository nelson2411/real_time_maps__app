import React from "react"
import { useMapbox } from "../hooks/useMapbox"

const initialPoint = {
  lng: -0.4382,
  lat: 38.875,
  zoom: 8.5,
}
const MapPage = () => {
  const { coords, setRef, newMarker$, markerMovement$ } =
    useMapbox(initialPoint)

  React.useEffect(() => {
    newMarker$.subscribe((marker) => {
      console.log("new marker", marker)
    })
  }, [newMarker$])

  // movement of the marker
  React.useEffect(() => {
    markerMovement$.subscribe((marker) => {
      console.log("marker moved", marker)
    })
  }, [markerMovement$])

  return (
    <>
      <div className="info">
        Longitude: {coords.lng} | Latitude: {coords.lat} | Zoom: {coords.zoom}
      </div>
      <div className="map-container" ref={setRef} />
    </>
  )
}

export default MapPage
