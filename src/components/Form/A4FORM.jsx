"use client";
import classes from "./A4FORM.module.css";
import FormCard from "../FormCard";
import {
  TextField,
  Stack,
  Button,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormLabel,
} from "@mui/material";

const A4Field = (props) => {
  const {
    type,
    text,
    defaultValue,
    variant,
    label,
    helperText,
    name,
    disabled,
    color,
    margin,
    error,
  } = props?.properties;

  return (
    <>
      <FormLabel>{text}</FormLabel>
      <TextField
        type={type}
        defaultValue={defaultValue}
        variant={variant}
        label={label}
        name={name}
        helperText={helperText}
        disabled={disabled}
        color={color}
        margin={margin}
        fullwidth
        error={error}
      />
    </>
  );
};
const A4Button = (props) => {
  const {
    text,
    onClick,
    variant, //text, contained, outlined
    href,
    color, //primary, secondary, success, warning, error
    disabled,
    size, //small, medium, large
    /* startIcon,
    endIcon,
    component, */
  } = props?.properties;

  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      href={href}
      disabled={disabled}
      color={color}
      /*  startIcon={startIcon}
      endIcon={endIcon}
      component={component} */
    >
      {text}
    </Button>
  );
};

const A4ButtonGroup = (props) => {
  const { spacing, direction, buttonData, divider } = props?.properties;

  const buttonNumber = buttonData?.length;

  return (
    <Stack direction={direction} spacing={spacing}>
      {buttonNumber &&
        buttonNumber !== 0 &&
        buttonData &&
        buttonData.map((item, index) => {
          const {
            text,
            onClick,
            variant, //text, contained, outlined
            href,
            color, //primary, secondary, success, warning, error
            disabled,
            size, //small, medium, large
            startIcon,
            endIcon,
            component,
          } = item;

          console.log(item);
          return (
            <Button
              key={Math.random() * buttonData.length}
              onClick={onClick}
              variant={variant}
              size={size}
              href={href}
              disabled={disabled}
              color={color}
              /* startIcon={startIcon}
              endIcon={endIcon} */
              /* component={component} */
            >
              {text}
            </Button>
          );
        })}
    </Stack>
  );
};

const A4Checkbox = (props) => {
  const {
    defaultChecked,
    value,
    label,
    onChange,
    required,
    disabled,
    color,
    /*    icon,
    checkedIcon, 
    */
  } = props?.properties;

  return (
    <FormControlLabel
      required={required}
      control={
        <Checkbox
          value={value}
          defaultChecked={defaultChecked}
          onChange={onChange}
          color={color}
          /* icon={icon}
          checkedIcon={checkedIcon}
           */
        />
      }
      label={label}
      disabled={disabled}
    />
  );
};

const A4RadioGroup = (props) => {
  const { text, defaultValue, row, name, onChange, radioData } =
    props?.properties;

  const radioNumber = radioData?.lenght;

  return (
    <>
      <FormLabel>{text}</FormLabel>
      <RadioGroup
        row={row}
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {radioNumber &&
          radioNumber !== 0 &&
          radioData &&
          radioData.map((item, index) => {
            const {
              value,
              label,
              labelPlacement,
              disabled, //text, contained, outlined
              color, //primary, secondary, success, warning, error
              size, //small, medium, large
            } = item;
            return (
              <FormControlLabel
                value={value}
                control={<Radio size={size} color={color} />}
                label={label}
                labelPlacement={labelPlacement}
                disabled={disabled}
              />
            );
          })}
      </RadioGroup>
    </>
  );
};

export default function A4FORM(props) {
  const { sectionTitle, inputsData, submitResult } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event);
    console.log(formData);
  };

  return (
    <FormCard sectionTitle={sectionTitle}>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ m: 1 }}>
          {inputsData &&
            inputsData.length !== 0 &&
            inputsData.map((item, index) => {
              console.log(item);
              const type = item?.inputType;
              const properties = item?.properties;
              if (type === "field") {
                return <A4Field properties={properties} />;
              } else if (type === "button") {
                return <A4Button properties={properties} />;
              } else if (type === "button_group") {
                return <A4ButtonGroup properties={properties} />;
              } else if (type === "checkbox") {
                return <A4Checkbox properties={properties} />;
              } else if (type === "radio_group") {
                return <A4RadioGroup properties={properties} />;
              }
            })}
        </FormControl>
      </form>
    </FormCard>
  );
}

/* [
  {
    name: "name",
    title: "title",
    default: "default value",
    type: "text",
    required: true,
    disabled: false,
    min: 0,
    max: 1000,
    placeholder: "placeholder",
  },
  {
    name: "name",
    title: "title",
    default: "default value",
    type: "text",
    required: true,
    disabled: false,
    min: 0,
    max: 1000,
    placeholder: "placeholder",
  },
  {
    name: "name",
    title: "title",
    default: "default value",
    type: "text",
    required: true,
    disabled: false,
    min: 0,
    max: 1000,
    placeholder: "placeholder",
  },
]; */
