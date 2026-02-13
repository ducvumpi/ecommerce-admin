import { useGetIdentity } from "@refinedev/core";

export const useRole = () => {
  const { data: identity } = useGetIdentity();
  return identity?.role;
};
