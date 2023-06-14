const { baseurl } = process.env;



const styles = (styles) => ({
    styles: styles.map(style => module.exports.style(style)),
    links:[{
        "rel": "self",
        "type": "application/json",
        "title": "This document",
        "href":  baseurl +"/styles?f=json"
    },
    {
        "rel": "alternate",
        "type": "text/html",
        "title": "This document as HTML",
        "href": baseurl +"/styles?f=html"
    }]
})

const style = (styleDesc) => {
    const { id, style, description, format } = styleDesc

    let styleJSON = {
        "id":id,
        "title": style,
        "description": description,
        "links": [
            {
                "rel": "describedby",
                "title": "Style metadata",
                "href": `${baseurl}/styles/${style}/metadata`
            },
            {
                "rel": "stylesheet",
                "type": "application/vnd.mapbox.style+json",
                "title": "Style in format 'MapboxStyle",
                "href": `${baseurl}/styles/${style}?f=mbs`
            },
            {
                "rel": "stylesheet",
                "type": "text/html",
                "title": "Web map using the style",
                "href": `${baseurl}/styles/${style}?f=html`
            },
        ],
    }


    return styleJSON
}

module.exports = {
    styles,
    style
  }