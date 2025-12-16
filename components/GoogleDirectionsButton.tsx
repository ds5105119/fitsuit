"use client";

import { useEffect, useMemo } from "react";
import useGeolocation from "@/hooks/geolocation";

const STORE_LAT = 37.512779;
const STORE_LNG = 127.057263;

// 두 좌표 사이 거리(km) 계산
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // 지구 반지름 (km)
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function GoogleDirectionsButton() {
  const { get, location } = useGeolocation();

  // 컴포넌트 마운트 시 한 번 현재 위치 요청 (권한 요청)
  useEffect(() => {
    if (typeof window === "undefined") return;
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 위치가 있으면 거리 계산
  const distanceKm = useMemo(() => {
    if (!location.loaded || location.error || !location.coordinates) return null;

    const { lat, lng } = location.coordinates;
    return getDistanceKm(lat, lng, STORE_LAT, STORE_LNG);
  }, [location]);

  const handleClick = () => {
    // 위치를 이미 받아온 경우: origin 포함해서 길찾기
    if (location.loaded && !location.error && location.coordinates) {
      const { lat, lng } = location.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${STORE_LAT},${STORE_LNG}`;
      window.open(url, "_blank");
      return;
    }

    // 위치를 못 받았거나 권한 거부된 경우: 목적지만
    const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${STORE_LAT},${STORE_LNG}`;
    window.open(fallbackUrl, "_blank");
  };

  return (
    <div className="flex justify-between">
      <button type="button" onClick={handleClick} className="text-xs lg:text-sm underline underline-offset-2 cursor-pointer">
        오시는 길
      </button>
      <p className="text-xs lg:text-sm text-neutral-500">{distanceKm !== null ? `${distanceKm.toFixed(1)} km` : ""}</p>
    </div>
  );
}
