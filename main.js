"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function jobArrived(s, flowElement, job) {
    let str = await (await flowElement.getPropertyStringValue("String")).toString();
    let separator = await (await flowElement.getPropertyStringValue("Separator")).toString();
    let pdKey = await (await flowElement.getPropertyStringValue("PrivateDataKey")).toString();
    if (str.includes(separator) == false) {
        await job.log(LogLevel.Warning, "The %1 is not present in %2", [separator, str]);
        await job.sendToData(Connection.Level.Warning);
        return;
    }
    let strParts = str.split(separator);
    await job.setPrivateData(pdKey + ".NumParts", strParts.length.toString());
    for (let i = 0; i < strParts.length; i++) {
        await job.setPrivateData(pdKey + "." + (i + 1), strParts[i]);
    }
    await job.sendToData(Connection.Level.Success);
}
async function validateProperties(s, flowElement, tags) {
    //[ { tag : String, valid: Boolean } ]
    let retval = [];
    let value;
    for (let i = 0; i < tags.length; i++) {
        await flowElement.log(LogLevel.Info, "Custom validation of " + tags[i]);
        value = await flowElement.getPropertyStringValue(tags[i]);
        await flowElement.log(LogLevel.Info, "Value is " + value);
        if (tags[i] == "Separator") {
            if (value.length == 1) {
                retval.push({ tag: tags[i], valid: true });
            }
            else {
                await flowElement.log(LogLevel.Error, "The value for separator must be just 1 character long");
                retval.push({ tag: tags[i], valid: false });
            }
        }
    }
    return retval;
}
//# sourceMappingURL=main.js.map