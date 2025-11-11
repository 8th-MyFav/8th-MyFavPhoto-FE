import { useMutation } from "@tanstack/react-query";
import React from "react";

export default function TanStackSample() {
  const fetchPoints = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/points`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setPoints(Number(data?.acc_point) || 0);
      }
    } catch (error) {
      console.error("포인트 불러오기 실패:", error);
    }
  };

  const changePoints = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/points`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // 항상 두가지 기억
  // (1) useQuery : 데이터를 가져오는 요청(get)
  // (2) useMutation : 데이터를 변경하는 요청(post, put, delete, patch)

  const { data, isLoading, error } = useQuery({
    queryKey: ["points"],
    queryFn: fetchPoints,
  });

  const changePointsMutation = useMutation({
    mutationFn: changePoints,
  });

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러가 발생했습니다.</div>;

  const handleChangePoints = () => {
    changePointsMutation.mutate();
  };

  return (
    <div>
      보유 포인트: {data?.acc_point}{" "}
      <button onClick={handleChangePoints}>포인트를변경하는버튼</button>
    </div>
  );
}
