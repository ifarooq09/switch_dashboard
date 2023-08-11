import { TitleProps, useRouterContext } from "@refinedev/core";
import { Button } from "@mui/material";
import React from "react";

import { logo, mail } from "assets";

type TitlePropsType = TitleProps

export const Title: React.FC<TitlePropsType> = ({ collapsed }) => {
  const { Link } = useRouterContext();

  return (
    <Button fullWidth variant="text" disableRipple>
      <Link to="/">
        {collapsed ? (
          <img src={logo} alt="Yariga" width="50px" />
        ) : (
          <img src={mail} alt="Refine" width="180px" />
        )}
      </Link>
    </Button>
  );
};
