// import { Alert } from "react-native";
// import { GOOGLE_API, API_URL } from "@env"
// const getTotalDistanceInMiles = async (start, destination, setData) => {
//     try {
//         const response = await fetch(
//             `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&key=${GOOGLE_API}`
//         );
//         const data = await response.json();

//         if (!data.routes || !data.routes[0]?.legs) {
//             throw new Error("No valid routes found.");
//         }

//         let distanceTo = data.routes[0].legs[0].distance.text;
//         distanceTo = distanceTo.replace(/,/g, ""); // Remove commas

//         // Convert various units to miles
//         if (distanceTo.toLowerCase().includes("mi") && !distanceTo.toLowerCase().includes("miles")) {
//             distanceTo = distanceTo.replace(/mi/gi, "");
//             distanceTo = (Number(distanceTo)).toFixed(2) + " miles";
//         } else if (distanceTo.toLowerCase().includes("km")) {
//             distanceTo = distanceTo.replace(/km/gi, "");
//             distanceTo = (Number(distanceTo) * 0.621371).toFixed(2) + " miles";
//         } else if (distanceTo.toLowerCase().includes("m") && !distanceTo.toLowerCase().includes("miles")) {
//             distanceTo = distanceTo.replace(/m/gi, "");
//             distanceTo = (Number(distanceTo) * 0.000621371).toFixed(2) + " miles";
//         } else if (distanceTo.toLowerCase().includes("ft")) {
//             distanceTo = distanceTo.replace(/ft/gi, "");
//             distanceTo = (Number(distanceTo) / 5280).toFixed(2) + " miles";
//         } else if (distanceTo.toLowerCase().includes("in")) {
//             distanceTo = distanceTo.replace(/in/gi, "");
//             distanceTo = (Number(distanceTo) / 63360).toFixed(2) + " miles";
//         } else if (distanceTo.toLowerCase().includes("yd")) {
//             distanceTo = distanceTo.replace(/yd/gi, "");
//             distanceTo = (Number(distanceTo) / 1760).toFixed(2) + " miles";
//         }

//         setData(distanceTo || "0.00 miles"); 
//     } catch (error) {
//         console.error("Error fetching or processing directions data:", error);
//         setData("0.00 miles"); // Fallback value
//     }
// };

// export default getTotalDistanceInMiles;


import { Alert } from "react-native";
import { GOOGLE_API } from "@env";

const getTotalDistanceAndDuration = async (start, destination, setData, setDuration) => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&key=${GOOGLE_API}`
        );
        const data = await response.json();

        if (!data.routes || !data.routes[0]?.legs) {
            throw new Error("No valid routes found.");
        }

        let distanceTo = data.routes[0].legs[0].distance.text;
        let durationTo = data.routes[0].legs[0].duration.text;

        distanceTo = distanceTo.replace(/,/g, ""); // Remove commas

        // Convert various units to miles
        if (distanceTo.toLowerCase().includes("mi") && !distanceTo.toLowerCase().includes("miles")) {
            distanceTo = distanceTo.replace(/mi/gi, "");
            distanceTo = (Number(distanceTo)).toFixed(2) + " miles";
        } else if (distanceTo.toLowerCase().includes("km")) {
            distanceTo = distanceTo.replace(/km/gi, "");
            distanceTo = (Number(distanceTo) * 0.621371).toFixed(2) + " miles";
        } else if (distanceTo.toLowerCase().includes("m") && !distanceTo.toLowerCase().includes("miles")) {
            distanceTo = distanceTo.replace(/m/gi, "");
            distanceTo = (Number(distanceTo) * 0.000621371).toFixed(2) + " miles";
        } else if (distanceTo.toLowerCase().includes("ft")) {
            distanceTo = distanceTo.replace(/ft/gi, "");
            distanceTo = (Number(distanceTo) / 5280).toFixed(2) + " miles";
        } else if (distanceTo.toLowerCase().includes("in")) {
            distanceTo = distanceTo.replace(/in/gi, "");
            distanceTo = (Number(distanceTo) / 63360).toFixed(2) + " miles";
        } else if (distanceTo.toLowerCase().includes("yd")) {
            distanceTo = distanceTo.replace(/yd/gi, "");
            distanceTo = (Number(distanceTo) / 1760).toFixed(2) + " miles";
        }

        setData(distanceTo || "0.00 miles");
        setDuration && setDuration(durationTo || "Unknown duration");

    } catch (error) {
        console.error("Error fetching or processing directions data:", error);
        setData({
            distance: "0.00 miles",
            duration: "Unknown duration",
        });
    }
};

export default getTotalDistanceAndDuration;

