// Tawk.to default widget loader. Replace the property ID with your workspace ID.
// Example: https://embed.tawk.to/{property_id}/{widget_id}
const TAWK_PROPERTY_ID = "6940f8b4ab0cd21983772660";
const TAWK_WIDGET_ID = "1jcisn1nv";

if (TAWK_PROPERTY_ID && TAWK_PROPERTY_ID !== "YOUR_TAWK_PROPERTY_ID") {
  var Tawk_API = Tawk_API || {},
    Tawk_LoadStart = new Date();
  (function () {
    var s1 = document.createElement("script"),
      s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    s0.parentNode.insertBefore(s1, s0);
  })();
}
