import React from "react";

interface Props {
  children: React.ReactNode;
}

export const Container: React.FC<Props> = ({ children }) => {
  return <div className="max-w-7xl mx-auto px-6">{children}</div>;
};
