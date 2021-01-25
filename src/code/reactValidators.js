export const lt = (value, props) => {
    // get the maxLength from component's props
    if (value.toString().trim().length > props.maxLength) {
        // Return jsx
        return <span className="error">The value exceeded {props.maxLength} characters.</span>
    }
};

export const gt = (value, props) => {
    // get the maxLength from component's props
    if (value.toString().trim().length < props.minLength) {
        // Return jsx
        return <span className="error">The value must be at least {props.minLength} characters.</span>
    }
};