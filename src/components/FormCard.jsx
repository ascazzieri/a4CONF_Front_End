"use client"
import { Container } from "@mui/material";
import classes from "./FormCard.module.css";
export default function FormCard(props) {
  const { sectionTitle } = props;
  return (
    <Container>
      <div style={{ display: "flex-box", justifyContent: "center" }}>
        <div className={classes.login_box}>
          <h2>{sectionTitle}</h2>
          <div>{props.children}</div>
        </div>
      </div>
    </Container>
  );
}
