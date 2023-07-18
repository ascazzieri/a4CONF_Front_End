const test = () => {
  console.log("click!");
};

const dummy_inputs = [
  {
    /*Text Field*/
    inputType: "field",
    properties: {
      type: "text",
      text: "IP address",
      defaultValue: "",
      variant: "outlined",
      label: "field di prova",
      name: "nome input",
      helperText: "helper text",
      disabled: false,
      color: "primary", //primary, secondary, success, warning, error
      margin: "normal",
      error: false,
    },
  },

  {
    /* Single Button*/
    inputType: "button",
    properties: {
      text: "click here",
      onClick: test,
      variant: "contained", //text, contained, outlined
      href: "#",
      color: "primary", //primary, secondary, success, warning, error
      disabled: false,
      size: "large", //small, medium, large
      /* startIcon: {},
      endIcon: {},
      component: {},
     */
    },
  },

  {
    /*Button Group*/
    inputType: "button_group",
    properties: {
      spacing: 5,
      direction: "row", //row, column
      divider: {},
      buttonData: [
        {
          text: "click here",
          onClick: test,
          variant: "contained", //text, contained, outlined
          href: "",
          color: "primary", //primary, secondary, success, warning, error
          disabled: false,
          size: "medium", //small, medium, large
          startIcon: {},
          endIcon: {},
          component: {},
        },
        {
          text: "click here",
          onClick: test,
          variant: "contained", //text, contained, outlined
          href: "",
          color: "primary", //primary, secondary, success, warning, error
          disabled: false,
          size: "medium", //small, medium, large
          startIcon: {},
          endIcon: {},
          component: {},
        },
        {
          text: "click here",
          onClick: test,
          variant: "contained", //text, contained, outlined
          href: "",
          color: "error", //primary, secondary, success, warning, error
          disabled: false,
          size: "medium", //small, medium, large
          startIcon: {},
          endIcon: {},
          component: {},
        },
      ],
    },
  },

  {
    /*CheckBox*/
    inputType: "checkbox",
    properties: {
      defaultChecked: false,
      value: "",
      label: "",
      onChange: test,
      required: false,
      disabled: false,
      color: "primary", //primary, secondary, success, warning, error
      /*    icon: {},
      checkedIcon: {},
       */
    },
  },

  {
    /*Radio Group*/
    inputType: "radio_group",
    properties: {
      text: "",
      row: true,
      defaultValue: "",
      name: "",
      onChange: {},
      radioData: [
        {
          value: "",
          label: "",
          disabled: false,
          size: "medium",
          color: "", //primary, secondary, success, warning, error,
          labelPlacement: "top", //top, start, bottom, end
        },
        {
          value: "",
          label: "",
          disabled: false,
          size: "medium",
          color: "", //primary, secondary, success, warning, error,
          labelPlacement: "top", //top, start, bottom, end
        },
        {
          value: "",
          label: "",
          disabled: false,
          size: "medium",
          color: "", //primary, secondary, success, warning, error,
          labelPlacement: "top", //top, start, bottom, end
        },
      ],
    },
  },
];

export { dummy_inputs };
