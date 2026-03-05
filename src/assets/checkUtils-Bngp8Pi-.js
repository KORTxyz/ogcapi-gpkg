function isvalidURL(str) {
    let url;
    try {
        url = new URL(str);
    }
    catch (_) {
        return false;
    }
    const result = url.protocol === "http:" || url.protocol === "https:";
    if (result)
        return result;
    else
        throw new Error("Not Valid URL");
}
function isValidDateString(value) {
    if (typeof value !== "string")
        return false;
    // Check if string looks like an ISO date
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;
    if (!isoDatePattern.test(value))
        return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
}

export { isvalidURL as a, isValidDateString as i };
//# sourceMappingURL=checkUtils-Bngp8Pi-.js.map

//# sourceMappingURL=checkUtils-Bngp8Pi-.js.map