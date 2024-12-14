import React from "react";

type VirtualTicketHeaderProps = {
  children?: React.ReactNode;
}

export const VirtualTicketHeader: React.FC<VirtualTicketHeaderProps> = ({children}) => {
  return <>{children}</>
}