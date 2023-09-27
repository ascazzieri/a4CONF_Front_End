import { Grid } from "@mui/material"
import React from "react";
import styled from "@emotion/styled";

const StyledButton = styled.button`
  font-family: Monserrat;
  font-size: 17px;
  padding: 0.8em 2em;
  font-weight: 500;
  background: #0d6efd;
  color: white;
  border: none;
  position: relative;
  overflow: hidden;
  border-radius: 0.6em;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
  
  .label {
    position: relative;
    top: -1px;
  }
  
  .transition {
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transition-duration: 500ms;
    background-color: #25AB25;
    border-radius: 9999px;
    width: 0;
    height: 0;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  
  &:hover .transition {
    width: 14em;
    height: 14em;
  }
  
  &:active {
    transform: scale(0.97);
  }
`;

export default function SaveButton() {
    return (

        <Grid container spacing={2}>
            <Grid item xs={10}></Grid>
            <Grid item xs={2}>
                <StyledButton style={{marginTop:5}}>
                    <span className="transition"></span>
                    <span className="label">Save</span>
                </StyledButton>
            </Grid>
        </Grid>
    );
}


