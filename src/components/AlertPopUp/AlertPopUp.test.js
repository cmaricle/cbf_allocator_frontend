import React from "react";
import { shallow } from "enzyme";
import AlertPopUp from "./AlertPopUp";

describe("AlertPopUp", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<AlertPopUp />);
    expect(wrapper).toMatchSnapshot();
  });
});
