"use client";

export const Button = ({
  children,
  action,
}: {
  action: () => void;
  children: React.ReactNode;
}) => {
  return <button onSubmit={action}>{children}</button>;
};
