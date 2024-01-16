import React from "react"
import { useMapbox } from "../hooks/useMapbox"
import { SocketContext } from "../context/Context"

const initialPoint = {
  lng: -0.4382,
  lat: 38.875,
  zoom: 8.5,
}
const MapPage = () => {
  const {
    coords,
    setRef,
    newMarker$,
    markerMovement$,
    addMarker,
    updateMarkerPosition,
  } = useMapbox(initialPoint)

  const { socket } = React.useContext(SocketContext)

  // liste the markers active in the map

  React.useEffect(() => {
    socket.on("active-markers", (markers) => {
      for (const key of Object.keys(markers)) {
        addMarker(markers[key], key)
      }
    })
  }, [socket, addMarker])
  /*
  events of the markers: 
  "active-markers"
  "new-marker"
  "update-marker"
  */

  React.useEffect(() => {
    newMarker$.subscribe((marker) => {
      socket.emit("new-marker", marker)
    })
  }, [newMarker$, socket])

  // movement of the marker
  React.useEffect(() => {
    markerMovement$.subscribe((marker) => {
      socket.emit("update-marker", marker)
    })
  }, [markerMovement$, socket])

  // move marker by sockets
  React.useEffect(() => {
    socket.on("update-marker", (marker) => {
      updateMarkerPosition(marker)
    })
  }, [socket, updateMarkerPosition])

  // listen to the new markers
  React.useEffect(() => {
    socket.on("new-marker", (marker) => {
      addMarker(marker, marker.id)
    })
  }, [socket, addMarker])

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
