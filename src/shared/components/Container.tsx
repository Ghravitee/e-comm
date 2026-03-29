import React from "react";

interface Props {
  children: React.ReactNode;
}

export const Container: React.FC<Props> = ({ children }) => {
  return <div className="max-w-340 mx-auto px-6">{children}</div>;
};
