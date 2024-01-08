import React from "react";
import { shallow } from "enzyme";
import NationFormBody from "./NationFormBody";

describe("NationFormBody", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<NationFormBody />);
    expect(wrapper).toMatchSnapshot();
  });
});
