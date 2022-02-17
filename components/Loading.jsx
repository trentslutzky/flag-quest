import React, { useEffect, useState } from "react";
import styled from "styled-components";

export function Loading(props) {
  return (
    <LoadingY>
      <LoadingX>
        <h1>Flag Quest</h1>
      </LoadingX>
    </LoadingY>
  );
}

const LoadingY = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 500px;
`;

const LoadingX = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;
