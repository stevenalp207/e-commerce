import React from "react";
import { BsBag } from "react-icons/bs";

interface OpenCartProps {
  className?: string;
  quantity?: number;
}

const OpenCart: React.FC<OpenCartProps> = ({
  className = "",
  quantity = 0,
}) => {
  return (
    <div className="relative text-xl text-dark hover:text-primary dark:border-darkmode-border dark:text-white">
      <BsBag className={`dark:hover:text-darkmode-primary ${className}`} />

      {quantity > 0 ? (
        <div className="bg-black text-white dark:bg-white dark:text-black text-xs rounded-full p-1 absolute -top-1 md:-top-2 -right-3 md:-right-4 w-5 h-5 flex items-center justify-center">
          {quantity}
        </div>
      ) : null}
    </div>
  );
};

export default OpenCart;
