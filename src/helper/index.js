export const thousandSeparator = (val) => {
    return val >= 0 ? val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
}