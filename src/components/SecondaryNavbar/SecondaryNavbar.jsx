"use client";
import * as React from "react";
import { Tabs } from "@mui/material";
import { Tab } from "@mui/material";

export default function SecondaryNavbar(props) {
  const { currentTab, setCurrentTab, navbarItems } = props;

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Tabs
      variant="scrollable"
      value={currentTab}
      onChange={handleChange}
      style={{marginBottom: 20, backgroundColor: '#1F293F', borderRadius: 10}}
    >
      {navbarItems.map((item, index) => (
        <Tab label={item} key={item + Math.random()} />
      ))}
    </Tabs>
  );
}
