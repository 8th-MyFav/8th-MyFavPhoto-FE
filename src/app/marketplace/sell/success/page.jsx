import React, { Suspense } from "react";
import SellSuccessPage from "./successPage";

const sellSuccess = () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SellSuccessPage />
    </Suspense>
  );
};

export default sellSuccess;
