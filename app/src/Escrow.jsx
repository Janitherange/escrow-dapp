import { Button } from "@chakra-ui/react";

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} </div>
        </li>
        <Button
          _hover={{
            boxShadow: "rgba(var(--primary-color), 0.5) 0px 0px 20px 0px",
          }}
          bg={
            "radial-gradient(circle, rgba(2,174,202,1) 0%, rgba(148,8,233,1) 100%)"
          }
          borderRadius={"50px"}
          padding={"25px 32px"}
          margin={"1rem 5rem"}
          cursor={"pointer"}
          _active={{
            transform: "scale(0.9)",
          }}
          color={"white"}
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          Approve
        </Button>
      </ul>
    </div>
  );
}
