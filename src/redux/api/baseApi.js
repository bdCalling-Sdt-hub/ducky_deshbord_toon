import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

// Enhanced base query to handle token refresh
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}api/v1`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("toon_authToken") || sessionStorage.getItem("toon_authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  
  // Make the original request
  let result = await baseQuery(args, api, extraOptions);
  
  // Log the result to debug
  // console.log("API request result:", result);
  
  // If the access token is expired, handle token refresh
  // if (result.error) {

  //   const refreshToken = Cookies.get("toon_refreshToken");

  //   if (result.error.status === 500) {
  //     // Call the refresh token API
  //     const refreshResult = await baseQuery(
  //       {
  //         url: "/auth/refresh-token",
  //         method: "POST",
  //         // body: { refreshToken: refreshToken },
  //         headers: {
  //           refreshToken: refreshToken,
  //         },
  //       }, // No body needed
  //       api,
  //       extraOptions
  //     );

  //     // console.log("Refresh token API result:", refreshResult);

  //     if (refreshResult?.data) {
  //       // Save the new access token to localStorage
  //       localStorage.removeItem("toon_authToken");
  //       sessionStorage.removeItem("toon_authToken");
  //       localStorage.setItem( "toon_authToken", refreshResult?.data?.accessToken );
  //       sessionStorage.setItem( "toon_authToken", refreshResult?.data?.accessToken );

  //       // Retry the original request with the new token
  //       result = await baseQuery(args, api, extraOptions);
  //     } else {
  //       // Refresh token failed or expired, log out the user
  //       // console.error("Refresh token invalid or expired. Logging out...");
  //       // localStorage.removeItem("toon_authToken");
  //       // sessionStorage.removeItem("toon_authToken");
  //       // Cookies.remove("toon_refreshToken");
  //       toast("Access token has expired, Please login again.");
  //     }
  //   } else if (result.error.status === 400) {
  //     // Handle bad request errors
  //     console.error("Bad request error:", result.error);
  //   } else {
  //     // Handle unexpected errors
  //     console.error("Unexpected error:", result.error);
  //   }
  // }

  return result;
};

// Create the API with the enhanced base query
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["UserData", "AdminData", "Product", "HowMade", "Orders", "Earnings", "faqs", "screens", "Shippings"],
  endpoints: () => ({}),
});

// Export the image URL as a constant
export const imageUrl = `${import.meta.env.VITE_BASE_URL}`;
