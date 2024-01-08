import React from "react";
import { shallow } from "enzyme";
import WebsiteHeader from "./WebsiteHeader";

describe("WebsiteHeader", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<WebsiteHeader />);
    expect(wrapper).toMatchSnapshot();
  });
});
