import { Spinner } from "@chakra-ui/react";

type Props = {
  size: string;
};

function Loading({ size, ...rest }: Props) {
  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="brand.900"
      size={size}
      {...rest}
    />
  );
}
export default Loading;
