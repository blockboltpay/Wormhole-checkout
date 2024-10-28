import React from 'react'

const TextboxComponent = ({
    error = "",
    label = "",
    subTitle = "",
    mandatory,
    title = "Textbox",
    className,
    extraClass,
    labelExtraIcon,
    loading,
    style,
    theme,
    tooltip,
    onChange,
    borderBottom,
    ...rest
}: any) => {
    const handleChange = (event: any) => {
        const { target } = event;
        const { value, name, ...otherAttributes } = target;
        const sanitizedValue = value.replace(/[\\{}=<>$#"]+/g, "");
        const newTarget = { ...otherAttributes, value: sanitizedValue, name: name };
        onChange({ ...event, target: newTarget });
    };
    return (
        <input
            className={className}
            maxLength={250}
            aria-label={title ? title : label}
            aria-labelledby={title ? title : label}
            title={title ? title : label}
            autoComplete="off"
            onChange={handleChange}
            {...rest}
        />
    )
}

export default TextboxComponent