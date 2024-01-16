import React from "react"
import mapboxgl from "mapbox-gl"
import { v4 as uuid } from "uuid"
import { Subject } from "rxjs"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY

export const useMapbox = (initialPoint) => {
  const mapDiv = React.useRef()
  const setRef = React.useCallback((node) => {
    mapDiv.current = node
  }, [])

  const markers = React.useRef({})

  // Observable of RxJS
  const markerMovement = React.useRef(new Subject())
  const newMarker = React.useRef(new Subject())

  // const [map, setMap] = useState()
  const mapOne = React.useRef()
  const [coords, setCoords] = React.useState(initialPoint)

  // function for adding markers
  const addMarker = React.useCallback((ev, id) => {
    const { lng, lat } = ev.lngLat || ev
    const marker = new mapboxgl.Marker()
    marker.id = id ?? uuid()
    marker.setLngLat([lng, lat]).addTo(mapOne.current).setDraggable(true)

    markers.current[marker.id] = marker

    if (!id) {
      // emit new marker
      newMarker.current.next({
        id: marker.id,
        lng,
        lat,
      })
    }

    // listen to drag event
    marker.on("drag", ({ target }) => {
      const { id } = target
      const { lng, lat } = target.getLngLat()

      // emit changes of the marker
      markerMovement.current.next({
        id,
        lng,
        lat,
      })
    })
  }, [])

  // function for updating the marker
  const updateMarkerPosition = React.useCallback((marker) => {
    const { id, lng, lat } = marker
    markers.current[id].setLngLat([lng, lat])
  }, [])

  React.useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      // center in Alicante (Spain)
      center: [initialPoint.lng, initialPoint.lat],
      zoom: initialPoint.zoom,
    })

    mapOne.current = map
  }, [initialPoint])

  // listen to map move event
  React.useEffect(() => {
    mapOne.current?.on("move", () => {
      const { lng, lat } = mapOne.current.getCenter()
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapOne.current.getZoom().toFixed(2),
      })
    })
  }, [])

  // add markers using a useEffect
  React.useEffect(() => {
    mapOne.current?.on("click", addMarker)
  }, [addMarker])

  return {
    addMarker,
    coords,
    markers,
    newMarker$: newMarker.current,
    markerMovement$: markerMovement.current,
    setRef,
    updateMarkerPosition,
  }
}
