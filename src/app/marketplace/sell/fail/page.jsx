import React, { Suspense } from "react";
import SellFailPage from "./failPage";

function sellFaile() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SellFailPage />
    </Suspense>
  );
}

export default sellFaile;
