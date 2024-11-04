var Checkbox = React.forwardRef((props, forwardedRef) => {
  const {
    __scopeCheckbox,
    name,
    checked: checkedProp,
    defaultChecked,
    required,
    disabled,
    value = "on",
    onCheckedChange,
    form,
    ...checkboxProps
  } = props;
  const [button, setButton] = React.useState(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
  const hasConsumerStoppedPropagationRef = React.useRef(false);
  const isFormControl = button ? form || !!button.closest("form") : true;
  const [checked = false, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  });
  const initialCheckedStateRef = React.useRef(checked);
  React.useEffect(() => {
    const form2 = button?.form;
    if (form2) {
      const reset = () => setChecked(initialCheckedStateRef.current);
      form2.addEventListener("reset", reset);
      return () => form2.removeEventListener("reset", reset);
    }
  }, [button, setChecked]);
  return /* @__PURE__ */ jsxs(CheckboxProvider, {
    scope: __scopeCheckbox,
    state: checked,
    disabled,
    children: [
      /* @__PURE__ */ jsx(Primitive.button, {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(props.onClick, (event) => {
          setChecked((prevChecked) =>
            isIndeterminate(prevChecked) ? true : !prevChecked
          );
          if (isFormControl) {
            hasConsumerStoppedPropagationRef.current =
              event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current)
              event.stopPropagation();
          }
        }),
      }),
      isFormControl &&
        /* @__PURE__ */ jsx(BubbleInput, {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" },
          defaultChecked: isIndeterminate(defaultChecked)
            ? false
            : defaultChecked,
        }),
    ],
  });
});
