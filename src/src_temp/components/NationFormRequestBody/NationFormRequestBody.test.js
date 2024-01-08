import React from "react";
import { shallow } from "enzyme";
import NationFormRequestBody from "./NationFormRequestBody";

describe("NationFormRequestBody", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<NationFormRequestBody />);
    expect(wrapper).toMatchSnapshot();
  });
});
