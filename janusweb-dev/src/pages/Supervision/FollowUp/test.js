const loadGoogleMapsApi = (callback) => {
  // Check if the Google Maps API script has already been loaded
  if (window.google && window.google.maps) {
    callback();
  } else {
    // Define the callback function to execute once the API is loaded
    window.googleMapsCallback = callback;

    // Create a script element to load the API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDvbyFcIQfY3KafIh_mexu9PTrQUesV_sk&libraries=places&callback=googleMapsCallback`;
    script.async = true;
    script.defer = true;

    // Append the script to the document
    document.body.appendChild(script);
  }
};

export default loadGoogleMapsApi;
