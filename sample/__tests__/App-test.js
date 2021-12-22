/**
 * @format
 */

import "react-native";
import React from "react";
import App from "../App";

// Note: test renderer must be required after react-native.
// eslint-disable-next-line import/order
import renderer from "react-test-renderer";

it("renders correctly", () => {
    renderer.create(<App />);
});
