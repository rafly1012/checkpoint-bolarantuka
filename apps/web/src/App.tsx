"use client"

import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@workspace/ui/components/item"

// fungsi hitung jarak (meter)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3
  const toRad = (x: number) => (x * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// cek waktu aktif
function isWithinTime(start: string, end: string, now: Date) {
  return now >= new Date(start) && now <= new Date(end)
}

export function App() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [now, setNow] = useState(new Date())

  // update waktu tiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // ambil lokasi user
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      },
      (err) => {
        console.error("Gagal ambil lokasi:", err)
      }
    )
  }, [])

  const MAX_DISTANCE = 130

  // formatter Intl
  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // data checkpoint
  const checkpoints = [
    {
      id: 1,
      name: "Check Point 01 - Hotel Palm Indah (Kegiatan Siang)",
      lat: -8.383662,
      lng: 123.397318,
      formUrl: "https://forms.gle/6t69mGbRPY3AazpD7",
      startTime: "2026-09-12T10:00:00",
      endTime: "2026-09-12T12:00:00",
    },
    {
      id: 2,
      name: "Check Point 02 - Hotel Palm Indah (Kegiatan Malam)",
      lat: -8.383662,
      lng: 123.397318,
      formUrl: "https://forms.gle/vSYDU8or5q6aNK9B6",
      startTime: "2026-09-12T17:00:00",
      endTime: "2026-09-12T17:30:00",
    },
    {
      id: 3,
      name: "Check Point 03 - Hotel Palm Indah (Pulang)",
      lat: -8.383662,
      lng: 123.397318,
      formUrl: "https://forms.gle/M8ARLRGMCNEPvTMU8",
      startTime: "2026-09-13T09:00:00",
      endTime: "2026-09-13T10:00:00",
    },
    {
      id: 4,
      name: "Check Point 03 - Hotel Lembata Indah (Pulang)",
      lat: -8.375610,
      lng: 123.415737,
      formUrl: "https://forms.gle/M8ARLRGMCNEPvTMU8",
      startTime: "2026-09-13T09:00:00",
      endTime: "2026-09-13T10:00:00",
    },
    {
      id: 5,
      name: "Check Point 03 - Hotel Olympic (Pulang)",
      lat: -8.372069,
      lng: 123.413622,
      formUrl: "https://forms.gle/M8ARLRGMCNEPvTMU8",
      startTime: "2026-09-13T09:00:00",
      endTime: "2026-09-13T10:00:00",
    },
  ]

  return (
    <div className="flex min-h-svh items-start justify-center p-6 bg-muted/40">
      <div className="w-full max-w-md flex flex-col gap-6 text-sm">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <img src="/img/bcf.png" className="h-15 w-15 object-contain" />
          <div>
            <h1 className="text-lg font-bold text-center">
              Branch Office Larantuka
            </h1>
          </div>
          <img src="/img/bri.png" className="h-15 w-15 object-contain" />
        </div>
        <img src="/img/poster.jpeg" className="h-full object-contain" />

        {/* LIST CHECKPOINT */}
        {checkpoints.map((cp) => {
          const distance =
            location &&
            getDistance(location.lat, location.lng, cp.lat, cp.lng)

          const isTimeValid = isWithinTime(cp.startTime, cp.endTime, now)

          const canClick =
            distance !== null &&
            distance <= MAX_DISTANCE &&
            isTimeValid

          const start = new Date(cp.startTime)
          const end = new Date(cp.endTime)

          const sameDay =
            start.toDateString() === end.toDateString()

          return (
            <Item
              key={cp.id}
              variant="outline"
              className="rounded-xl shadow-sm bg-background"
            >
              <ItemContent>
                <ItemTitle className="text-base font-semibold">
                  {cp.name}
                </ItemTitle>

                <ItemDescription className="mt-1 text-xs line-clamp-5">
                  <div><b>Koordinat:</b> {cp.lat}, {cp.lng}</div>

                  <div>
                    <b>Jarak:</b>{" "}
                    {distance !== null
                      ? `${distance.toFixed(1)} meter`
                      : "Mengambil lokasi..."}
                  </div>

                  <div>
                    <b>Tanggal:</b>{" "}
                    {sameDay
                      ? dateFormatter.format(start)
                      : `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`}
                  </div>

                  <div>
                    <b>Waktu:</b>{" "}
                    {`${timeFormatter.format(start)} - ${timeFormatter.format(end)} WITA`}
                  </div>
                </ItemDescription>
              </ItemContent>

              <ItemActions>
                <Button
                  variant={canClick ? "default" : "secondary"}
                  size="sm"
                  disabled={!canClick}
                  className="min-w-22.5"
                  onClick={() => {
                    if (canClick) {
                      window.open(cp.formUrl, "_blank")
                    }
                  }}
                >
                  {!isTimeValid
                    ? now < start
                      ? "Belum mulai"
                      : "Sudah lewat"
                    : distance !== null && distance > MAX_DISTANCE
                    ? "Terlalu jauh"
                    : "Isi Form"}
                </Button>
              </ItemActions>
            </Item>
          )
        })}
      </div>
    </div>
  )
}
