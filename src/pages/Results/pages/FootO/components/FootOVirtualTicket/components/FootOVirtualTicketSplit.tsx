import React from "react";
import { ProcessedSplitModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts";
import VirtualTicketControl from "../../../../../components/VirtualTicket/VirtualTicketControl.tsx";
import VirtualTicketSplitTime from "../../../../../components/VirtualTicket/VirtualTicketSplitTime.tsx";

type FootOVirtualTicketProps = {
  split: ProcessedSplitModel;
};

/**
 * Display a foot-o splits line within a virtual ticket.
 * @param split Split to be displayed
 */
const FootOVirtualTicketSplit: React.FC<FootOVirtualTicketProps> = ({ split }) => {
  return (
    <>
      <VirtualTicketControl
        control={split.control}
        order_number={split.order_number}
        gridWidth={2.6}
      />
      <VirtualTicketSplitTime
        time={split.time}
        time_behind={split.time_behind}
        position={split.position}
      />
      <VirtualTicketSplitTime
        time={split.cumulative_time}
        time_behind={split.cumulative_behind}
        position={split.cumulative_position}
      />
    </>
  );
};

export default FootOVirtualTicketSplit;
